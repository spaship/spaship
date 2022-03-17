package io.spaship.operator.service.k8s;

import io.spaship.operator.business.EventManager;
import io.spaship.operator.type.Environment;
import io.spaship.operator.type.EventStructure;
import io.spaship.operator.type.OperationResponse;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.WebClientOptions;
import io.vertx.mutiny.core.Vertx;
import io.vertx.mutiny.core.buffer.Buffer;
import io.vertx.mutiny.ext.web.client.HttpResponse;
import io.vertx.mutiny.ext.web.client.WebClient;
import io.vertx.mutiny.ext.web.multipart.MultipartForm;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@ApplicationScoped
public class SideCarOperations {
    private static final Logger LOG = LoggerFactory.getLogger(SideCarOperations.class);
    private final WebClient client;
    private final EventManager eventManager;
    private final ExecutorService executor
            = Executors.newFixedThreadPool(10); //TODO smartly handle this thread as it will only support 10 environments at a time
    private final Operator k8sOperator;



    public SideCarOperations(Vertx vertx,
                             EventManager eventManager,
                             Operator k8sOperator) {
      this.k8sOperator = k8sOperator;
      WebClientOptions options = new WebClientOptions()
                .setUserAgent("spaship-operator/0.0.1");
        this.client = WebClient.create(vertx, options);

        this.eventManager = eventManager;
    }


    //TODO 1. remove manual thread handling 2. replace hard coded time with pod ready status
    public void asyncCreateOrUpdateSPDirectory(OperationResponse operationResponse) {
        executor.submit(() -> {
            var envName = operationResponse.getEnvironmentName();
            if (operationResponse.getStatus() == 1)
                LOG.info("env {} is a new environment", envName);
            var res = createOrUpdateSPDirectory(operationResponse);
            LOG.info("sidecar ops completed with following response {}", res);
        });
    }


    @SneakyThrows
    public String triggerSync(String sidecarUrl, String syncConfig,Environment environment){

      sidecarUrl = sidecarUrl.replace("tcp", "http");
      LOG.debug("sidecar url {} syncConfig details {}", sidecarUrl, syncConfig);
      var sideCarUrlPart = sidecarUrl.split(":");
      var host = "http://".concat(sideCarUrlPart[1].replace("//", ""));
      var port = sideCarUrlPart[2];
      var requestUri = host.concat(":").concat(port).concat("/api/sync");
      LOG.info("sidecar env {} url, {}", environment, requestUri);

      waitForReadiness(environment,15);

      return  client.requestAbs(HttpMethod.POST, requestUri)
        .sendJson(syncConfig)
        .map(HttpResponse::bodyAsString)
        .onFailure()
        .retry()
        .withBackOff(Duration.ofSeconds(2), Duration.ofSeconds(4))
        .atMost(30).onFailure()
        .recoverWithItem(e -> new JsonObject().put("status","failed to communicate due to "+e.getMessage()).encodePrettily())
        .subscribeAsCompletionStage().get();

    }

    @SneakyThrows
    //TODO break into multiple methods
    private OperationResponse createOrUpdateSPDirectory(OperationResponse operationResponse) {
        var sideCarUrl = operationResponse.getSideCarServiceUrl().replace("tcp", "http");
        var environment = operationResponse.getEnvironment();
        LOG.debug("sidecar url {} invoked with the following details {}", sideCarUrl, environment);
        environment.setOperationPerformed(true);
        var sideCarUrlPart = sideCarUrl.split(":");
        var host = "http://".concat(sideCarUrlPart[1].replace("//", ""));
        var port = sideCarUrlPart[2];

        MultipartForm form = MultipartForm.create()
                .textFileUpload("spa", operationResponse.spaName(), operationResponse.filePath().toAbsolutePath()
                        .toString(), "application/zip"
                );

        var responseOnFailure = OperationResponse.builder().environment(environment)
                .sideCarServiceUrl(operationResponse.getSideCarServiceUrl()).status(0)
                .originatedFrom(this.getClass().toString());

        var requestUri = host.concat(":").concat(port).concat("/api/upload");
        LOG.info("sidecar env {} url, {}", operationResponse.getEnvironmentName(), requestUri);

      waitForReadiness(operationResponse.getEnvironment());

      var opResp = client.requestAbs(HttpMethod.POST, requestUri).sendMultipartForm(form)
                .map(item -> apply(responseOnFailure, item))
                .onFailure()
                .retry()
                .withBackOff(Duration.ofSeconds(2), Duration.ofSeconds(4))
                .atMost(30)
                .onFailure()
                .recoverWithItem(e -> fallbackResponse(responseOnFailure, e))
                .subscribeAsCompletionStage()
                .get();

        eventManager.queue(
                EventStructure.builder()
                        .websiteName(opResp.getEnvironment().getWebsiteName())
                        .environmentName(opResp.getEnvironment().getName())
                        .uuid(operationResponse.getEnvironment().getTraceID())
                        .state(opResp.getErrorMessage() == null ?
                                "spa deployment ops performed" : "spa deployment ops failed")
                        .spaName(operationResponse.getSpaName())
                        .build());

        return opResp;
    }

    private void waitForReadiness(Environment env) throws InterruptedException {
      waitForReadiness(env,150);
    }

    private void waitForReadiness(Environment env, int threshold) throws InterruptedException {
      int attempt = 0;
      while(!k8sOperator.isEnvironmentAvailable(env)){
        if(attempt==0)
          LOG.info("waiting for readiness of {}.{} ",env.getName(),env.getWebsiteName());
        Thread.sleep(4000);
        if(attempt>threshold){
          LOG.warn("environment {}.{} still not ready, releasing the block to prevent from infinite looping "
            ,env.getName(),env.getWebsiteName());
          break;
        }
        attempt++;
      }
    LOG.info("environment {}.{} is ready, total no retry attempt is {}",env.getName(),env.getWebsiteName(),attempt);
  }

  private OperationResponse fallbackResponse(OperationResponse.OperationResponseBuilder responseOnFailure, Throwable e) {
        LOG.error("sidecar upload ops failed due to {}", e.getMessage());
        return responseOnFailure.errorMessage(e.getMessage()).build();
    }

    private OperationResponse apply(OperationResponse.OperationResponseBuilder responseOnFailure,
                                    HttpResponse<Buffer> item) {
        var responseFromSidecar = item.bodyAsJson(OperationResponse.class);
        if (Objects.isNull(responseFromSidecar))
            return responseOnFailure.errorMessage("status code: "
                    .concat(Integer.toString(item.statusCode()))
                    .concat(" message: ")
                    .concat(item.statusMessage())).build();
        LOG.debug("sidecar response if  {}", responseFromSidecar);
        return responseFromSidecar;
    }


}
