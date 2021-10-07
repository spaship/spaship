package io.spaship.operator.api;

import io.smallrye.mutiny.Uni;
import io.spaship.operator.service.k8s.Operator;
import io.spaship.operator.type.Environment;
import io.spaship.operator.type.OperationResponse;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.Objects;

@Path("environment")
public class EnvironmentController {


    private final Operator k8sOperator;

    public EnvironmentController(Operator k8sOperator) {
        this.k8sOperator = k8sOperator;
    }


    @POST
    @Path("/purge")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Uni<OperationResponse> upload(Environment environment) {
        Objects.requireNonNull(environment.getName());
        Objects.requireNonNull(environment.getWebsiteName());
        Objects.requireNonNull(environment.getNameSpace());
        Objects.requireNonNull(environment.getWebsiteVersion());
        return k8sOperator.deleteEnvironment(environment);
    }


}
