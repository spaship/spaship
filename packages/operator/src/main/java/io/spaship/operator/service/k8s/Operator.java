package io.spaship.operator.service.k8s;

import io.fabric8.kubernetes.api.model.*;
import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.api.model.apps.StatefulSet;
import io.fabric8.kubernetes.api.model.networking.v1.Ingress;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.internal.readiness.Readiness;
import io.fabric8.openshift.api.model.Route;
import io.fabric8.openshift.client.OpenShiftClient;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.infrastructure.Infrastructure;
import io.spaship.operator.business.EventManager;
import io.spaship.operator.exception.FeatureNotImplementedException;
import io.spaship.operator.exception.ResourceNotFoundException;
import io.spaship.operator.service.Operations;
import io.spaship.operator.type.Environment;
import io.spaship.operator.type.EventStructure;
import io.spaship.operator.type.OperationResponse;
import io.spaship.operator.util.ReUsableItems;
import org.eclipse.microprofile.config.ConfigProvider;
import org.javatuples.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import java.util.*;


@ApplicationScoped
public class Operator implements Operations {
  private static final Logger LOG = LoggerFactory.getLogger(Operator.class);
  private static final String MANAGED_BY = "managedBy";
  private static final String WEBSITE = "website";
  private static final String ENVIRONMENT = "environment";
  private static final String SPASHIP = "spaship";
  private final KubernetesClient k8sClient;
  private final EventManager eventManager;
  private final String domain;
  private final String appInstance;

  public Operator(KubernetesClient k8sClient, EventManager eventManager) {
    this.k8sClient = k8sClient;
    this.eventManager = eventManager;
    domain = ConfigProvider.getConfig().getValue("operator.domain.name", String.class);
    appInstance = setAppInstanceValue();
  }

  private String setAppInstanceValue() {
    var propertyValue = ConfigProvider.getConfig().getValue("app.instance", String.class);
    if (Objects.isNull(propertyValue) || propertyValue.isEmpty() || propertyValue.isBlank()) {
      LOG.warn("property app.instance is not set, going with the default value");
      propertyValue = "default";
    }
    return propertyValue;
  }


  public OperationResponse createOrUpdateEnvironment(Environment environment) {

    domainValidation(domain);

    ReUsableItems.enforceOpsLocking(new Pair<>(environment.getIdentification(), environment.getTraceID()));

    boolean envExists = environmentExists(environment);
    LOG.debug("envExists is {}", envExists);
    if (!envExists)
      createNewEnvironment(environment);
    String sideCarSvcUrl = environmentSidecarUrl(environment);
    environment.setOperationPerformed(true);

    ReUsableItems.releaseLock(environment.getIdentification());
    LOG.debug("\n");
    return OperationResponse.builder().environment(environment).sideCarServiceUrl(sideCarSvcUrl)
      .originatedFrom(this.getClass().toString()).status(envExists ? 2 : 1).build();
  }

  private void domainValidation(String domain) {
    if (Objects.isNull(domain)) {
      LOG.error("the domain name is missing");
      throw new ResourceNotFoundException("property operator.domain.name is not set");
    }
  }


  public boolean environmentExists(Environment environment) {
    Map<String, String> labels = searchCriteriaLabel(environment);
    List<Pod> matchedPods = k8sClient.pods().inNamespace(environment.getNameSpace()).withLabels(labels).list()
      .getItems();
    LOG.debug("{} no of matched pod found with search criteria {}", matchedPods.size(), labels);
    return !matchedPods.isEmpty();
  }

  public OperationResponse removeSPA(Environment env) {
    throw new FeatureNotImplementedException();
  }

  public Uni<OperationResponse> deleteEnvironment(Environment environment) {

    return Uni.createFrom().item(buildK8sResourceList(environment))
      .emitOn(Infrastructure.getDefaultExecutor())
      .map(resourceList -> applyDeleteResourceList(environment, resourceList))
      .onFailure()
      .recoverWithItem(
        throwable -> OperationResponse.builder().environment(environment)
          .sideCarServiceUrl("NA").errorMessage(throwable.getMessage())
          .originatedFrom(this.getClass().toString()).status(0).build()
      );

  }


  void createNewEnvironment(Environment environment) {
    KubernetesList result = buildK8sResourceList(environment);
    LOG.debug("create environment is in progress");
    processK8sList(result, environment.getTraceID(), environment.getNameSpace());
  }

  public String environmentSidecarUrl(Environment environment) {
    String serviceName = "svc"
      .concat("-")
      .concat(appInstance)
      .concat("-")
      .concat(environment.getWebsiteName().toLowerCase())
      .concat("-")
      .concat(environment.getName().toLowerCase());
    LOG.debug("computed service name is {}", serviceName);

    return Optional.ofNullable(k8sClient.services().inNamespace(environment.getNameSpace()).withName(serviceName))
      .map(svc -> svc.getURL("http-api"))
      .orElseThrow(() -> {
        throw new ResourceNotFoundException("service:" + serviceName);
      });
  }

  Map<String, String> searchCriteriaLabel(Environment environment) {
    return Map.of(MANAGED_BY, SPASHIP,
      WEBSITE, environment.getWebsiteName().toLowerCase(),
      ENVIRONMENT, environment.getName().toLowerCase(),
      "websiteVersion", environment.getWebsiteVersion().toLowerCase()
    );
  }

  private OperationResponse applyDeleteResourceList(Environment environment, KubernetesList resourceList) {
    LOG.debug("applying delete on resources");
    //Should we delete the pvs as well? will that be a good idea?
    boolean isDeleted = k8sClient.resourceList(resourceList).inNamespace(environment.getNameSpace()).delete();
    environment.setOperationPerformed(true);
    var or = OperationResponse.builder().environment(environment)
      .sideCarServiceUrl("NA")
      .originatedFrom(this.getClass().toString());
    or.status(3);
    if (!isDeleted)
      or.status(0).errorMessage("unable to delete the resources");
    return or.build();
  }


  private KubernetesList buildK8sResourceList(Environment environment) {
    Map<String, String> templateParameters = Map.of(
      "WEBSITE", environment.getWebsiteName().toLowerCase(),
      //"TRACE_ID", environment.getTraceID().toString().toLowerCase(),
      "ENV", environment.getName().toLowerCase(),
      "WEBSITE_VERSION", environment.getWebsiteVersion().toLowerCase(),
      "DOMAIN", domain,
      "APP_INSTANCE_PREFIX", appInstance,
      "STORAGE_CLASS", ConfigProvider.getConfig().getValue("storage.class", String.class)
    );
    LOG.debug("building KubernetesList, templateParameters are as follows {}", templateParameters);
    return ((OpenShiftClient) k8sClient)
      .templates()
      .inNamespace(environment.getNameSpace())
      .load(Operations.class.getResourceAsStream("/openshift/environment-template.yaml"))
      .processLocally(templateParameters);
  }


  public boolean isEnvironmentAvailable(Environment environment) {
    boolean isAvailable = false;

    Objects.requireNonNull(environment.getName(), "environment name not fond in env object");
    Objects.requireNonNull(environment.getWebsiteName(), "website name not found in env object");
    Objects.requireNonNull(environment.getNameSpace(), "website namespace not found in env object");
    Map<String, String> labels = Map.of(
      MANAGED_BY, SPASHIP,
      WEBSITE, environment.getWebsiteName(),
      ENVIRONMENT, environment.getName()
    );
    var pods = k8sClient.pods()
      .inNamespace(environment.getNameSpace()).withLabels(labels).list().getItems();

    if (Objects.isNull(pods)) {
      LOG.warn("List<Pod> is null");
      return isAvailable;
    }
    if (pods.isEmpty()) {
      LOG.info("no pod found with the following details {}", labels);
      return isAvailable;
    }
    if (pods.size() > 1)
      LOG.warn("more than one pod found with the same criteria");


    var pod0 = pods.get(0);
    var phase = pod0.getStatus().getPhase();
    var readiness = Readiness.isPodReady(pod0);
    LOG.debug("pod phase is {} ", phase);
    return phase.equalsIgnoreCase("Running") && readiness;

  }

  //TODO remove if blocks
  private void processK8sList(KubernetesList result, UUID tracing, String nameSpace) {

    var eb = EventStructure.builder().uuid(tracing);

    result.getItems().forEach(item -> {
      if (item instanceof Service) {
        LOG.debug("creating new Service in K8s, tracing = {}", tracing);
        k8sClient.services().inNamespace(nameSpace).createOrReplace((Service) item);
        eb.websiteName(item.getMetadata().getLabels().get(WEBSITE))
          .environmentName(item.getMetadata().getLabels().get(ENVIRONMENT))
          .state("service created");
      }
      if (item instanceof Deployment) {
        LOG.debug("creating new Deployment in K8s, tracing = {}", tracing);
        k8sClient.apps().deployments().inNamespace(nameSpace).createOrReplace((Deployment) item);
        eb.websiteName(item.getMetadata().getLabels().get(WEBSITE))
          .environmentName(item.getMetadata().getLabels().get(ENVIRONMENT))
          .state("deployment created");
      }
      if (item instanceof StatefulSet) {
        LOG.debug("creating new Deployment in K8s, tracing = {}", tracing);
        k8sClient.apps().statefulSets().inNamespace(nameSpace).createOrReplace((StatefulSet) item);
        eb.websiteName(item.getMetadata().getLabels().get(WEBSITE))
          .environmentName(item.getMetadata().getLabels().get(ENVIRONMENT))
          .state("StatefulSet created");

      }
      if (item instanceof PersistentVolumeClaim) {
        LOG.debug("creating new pvc in K8s, tracing = {}", tracing);
        k8sClient.persistentVolumeClaims().inNamespace(nameSpace).createOrReplace((PersistentVolumeClaim) item);
        eb.websiteName(item.getMetadata().getLabels().get(WEBSITE))
          .environmentName(item.getMetadata().getLabels().get(ENVIRONMENT))
          .state("pvc created");
      }
      if (item instanceof Route) {
        LOG.debug("creating new Route in K8s, tracing = {}", tracing);
        ((OpenShiftClient) k8sClient).routes().inNamespace(nameSpace).createOrReplace((Route) item);
        eb.websiteName(item.getMetadata().getLabels().get(WEBSITE))
          .environmentName(item.getMetadata().getLabels().get(ENVIRONMENT))
          .state("route created");
      }
      if (item instanceof ConfigMap) {
        LOG.debug("creating new ConfigMap in K8s, tracing = {}", tracing);
        k8sClient.configMaps().inNamespace(nameSpace).createOrReplace((ConfigMap) item);
        eb.websiteName(item.getMetadata().getLabels().get(WEBSITE))
          .environmentName(item.getMetadata().getLabels().get(ENVIRONMENT))
          .state("configmap created");
      }
      if (item instanceof Ingress) {
        LOG.debug("creating new Ingress controller in K8s, tracing = {}", tracing);
        k8sClient.network().v1().ingresses().inNamespace(nameSpace).createOrReplace((Ingress) item);
      }

      eventManager.queue(eb.build());
    });


  }


}
