package io.spaship.operator.service.k8s;

import io.spaship.operator.business.EventManager;
import io.spaship.operator.type.EventStructure;
import io.spaship.operator.type.OperationResponse;
import io.vertx.core.http.HttpMethod;
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

    public SideCarOperations(Vertx vertx, EventManager eventManager) {
        WebClientOptions options = new WebClientOptions()
                .setUserAgent("spaship-operator/0.0.1");
        this.client = WebClient.create(vertx, options);

        this.eventManager = eventManager;
    }


    //TODO 1. remove manual thread handling 2. replace hard coded time with pod ready status
    public void asyncCreateOrUpdateSPDirectory(OperationResponse operationResponse) {
        executor.submit(() -> {
            var envName = operationResponse.getEnvironmentName();
            if (operationResponse.getStatus() == 1) {
                LOG.info("env {} is a new environment hence blocking sidecar ops for 60s", envName);
                blockFor(60000);
            }
            var res = createOrUpdateSPDirectory(operationResponse);
            LOG.info("sidecar ops completed with following response {}", res);
        });
    }

    @SneakyThrows
    private void blockFor(int timeInMillis) {
        Thread.sleep(timeInMillis);
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

        var opResp = client.requestAbs(HttpMethod.POST, requestUri).sendMultipartForm(form)
                .map(item -> apply(responseOnFailure, item))
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
                        .build());

        return opResp;
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
