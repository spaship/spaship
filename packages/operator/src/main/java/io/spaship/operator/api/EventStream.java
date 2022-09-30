package io.spaship.operator.api;

import io.smallrye.mutiny.Multi;
import io.vertx.mutiny.core.Vertx;
import org.eclipse.microprofile.config.ConfigProvider;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/event")
public class EventStream {

  private final Vertx vertx;
  private final String busAddress;

  public EventStream(Vertx vertx) {
    this.vertx = vertx;
    busAddress = ConfigProvider.getConfig().getValue("operator.event.bus.address", String.class);
  }

  @GET
  @Produces(MediaType.SERVER_SENT_EVENTS)
  public Multi<String> streamEvents() {
    return vertx.eventBus()
      .consumer(busAddress)
      .toMulti()
      .map(item -> item.body().toString());
  }
}
