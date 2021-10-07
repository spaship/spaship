package io.spaship.operator.service.k8s;

import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.api.model.Service;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.Watcher;
import io.fabric8.kubernetes.client.WatcherException;
import io.fabric8.openshift.api.model.Route;
import io.fabric8.openshift.client.OpenShiftClient;
import io.quarkus.runtime.StartupEvent;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Named;
import java.util.Map;

@ApplicationScoped
public class SpashipManagedResourceWatcher {

    private final KubernetesClient kubernetesClient;
    private final String nameSpace;
    private final Map<String,String> filter = Map.of("managedBy","spaship");

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

            }

            @Override
            public void onClose(WatcherException cause) {

            }
        });
    }

    private void serviceWatcher(String nameSpace,Map<String,String> filter) {
        kubernetesClient.services().inNamespace(nameSpace)
                .withLabels(filter).watch(new Watcher<Service>() {
            @Override
            public void eventReceived(Action action, Service resource) {

            }

            @Override
            public void onClose(WatcherException cause) {

            }
        });
    }

    private void podWatcher(String nameSpace,Map<String,String> filter) {
        kubernetesClient.pods().inNamespace(nameSpace)
                .withLabels(filter).watch(new Watcher<Pod>() {
            @Override
            public void eventReceived(Action action, Pod resource) {

            }

            @Override
            public void onClose(WatcherException cause) {

            }
        });
    }
}
