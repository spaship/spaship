package io.spaship.operator.service.k8s;

import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.api.model.Service;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.Watcher;
import io.fabric8.kubernetes.client.WatcherException;
import io.fabric8.openshift.api.model.Route;
import io.fabric8.openshift.client.OpenShiftClient;
import io.quarkus.runtime.StartupEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Named;
import java.util.Map;

@ApplicationScoped
public class SpashipManagedResourceWatcher {

    private final KubernetesClient kubernetesClient;
    private final String nameSpace;
    private final Map<String,String> filter = Map.of("managedBy","spaship");
    private static final Logger LOG = LoggerFactory.getLogger(SpashipManagedResourceWatcher.class);

    public SpashipManagedResourceWatcher(KubernetesClient kubernetesClient, @Named("namespace") String nameSpace) {
        this.kubernetesClient = kubernetesClient;
        this.nameSpace = nameSpace;
    }

    void onStartup(@Observes StartupEvent startupEvent){

        podWatcher(nameSpace,filter);

        serviceWatcher(nameSpace,filter);

        routeWatcher(nameSpace,filter);

    }

    private void routeWatcher(String nameSpace,Map<String,String> filter) {
        ((OpenShiftClient)kubernetesClient).routes()
                .inNamespace(nameSpace).withLabels(filter).watch(new Watcher<Route>() {
            @Override
            public void eventReceived(Action action, Route resource) {
              LOG.debug("route eventReceived on resource {} , action {}",action.name(),
                resource.getMetadata().getName());
            }

            @Override
            public void onClose(WatcherException cause) {
              LOG.debug("route onClose exception is {}",cause.asClientException().getMessage());

            }
        });
    }

    private void serviceWatcher(String nameSpace,Map<String,String> filter) {
        kubernetesClient.services().inNamespace(nameSpace)
                .withLabels(filter).watch(new Watcher<Service>() {
            @Override
            public void eventReceived(Action action, Service resource) {
              LOG.debug("service eventReceived on resource {} , action {}",action.name(),
                resource.getMetadata().getName());
            }

            @Override
            public void onClose(WatcherException cause) {
              LOG.debug("service onClose exception is {}",cause.asClientException().getMessage());
            }
        });
    }

    private void podWatcher(String nameSpace,Map<String,String> filter) {
        kubernetesClient.pods().inNamespace(nameSpace)
                .withLabels(filter).watch(new Watcher<Pod>() {
            @Override
            public void eventReceived(Action action, Pod resource) {
              LOG.debug("POD eventReceived on resource {} , action {}",action.name(),resource.getMetadata().getName());
            }

            @Override
            public void onClose(WatcherException cause) {
              LOG.debug("POD onClose exception is {}",cause.asClientException().getMessage());
            }
        });
    }
}
