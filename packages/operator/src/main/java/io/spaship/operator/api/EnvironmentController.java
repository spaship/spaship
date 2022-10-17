package io.spaship.operator.api;

import io.smallrye.common.annotation.NonBlocking;
import io.smallrye.mutiny.Uni;
import io.spaship.operator.service.k8s.Operator;
import io.spaship.operator.service.k8s.SideCarOperations;
import io.spaship.operator.type.Environment;
import io.spaship.operator.type.OperationResponse;
import io.quarkus.security.Authenticated;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Objects;

@Path("environment")
@Authenticated
public class EnvironmentController {


  private final Operator k8sOperator;
  private final SideCarOperations sidecarOps;

  public EnvironmentController(Operator k8sOperator, SideCarOperations sidecarOps) {
    this.k8sOperator = k8sOperator;
    this.sidecarOps = sidecarOps;
  }


  @POST
  @Path("/purge")
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  public Uni<OperationResponse> upload(Environment environment) {
    Objects.requireNonNull(environment.getName());
    Objects.requireNonNull(environment.getWebsiteName());
    Objects.requireNonNull(environment.getNameSpace());
    return k8sOperator.deleteEnvironment(environment);
  }


  @POST
  @Path("/sync")
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  @NonBlocking
  public Uni<String> scheduleSync(@QueryParam("envName") String envName,
                                  @QueryParam("websiteName") String websiteName,
                                  @QueryParam("nameSpace") String nameSpace,
                                  String syncRequestBody) {

    Environment environment = new Environment(
      envName,
      websiteName,
      null,
      nameSpace,
      true,
      null,
      null,
      null,
      null,
      null,
      true,
      false);
    return sidecarOps.triggerSyncAsync(syncRequestBody, environment);

  }


}
