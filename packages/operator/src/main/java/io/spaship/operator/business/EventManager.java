package io.spaship.operator.business;

import io.spaship.operator.type.EventStructure;
import io.vertx.core.json.JsonObject;
import io.vertx.mutiny.core.Vertx;
import org.eclipse.microprofile.config.ConfigProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;

@Singleton
public class EventManager {

  private static final Logger LOG = LoggerFactory.getLogger(EventManager.class);
  private final String busAddress;
  private final Vertx vertx;


  public EventManager(Vertx vertx) {
    this.vertx = vertx;
    busAddress = ConfigProvider.getConfig().getValue("operator.event.bus.address", String.class);
  }

  public void queue(EventStructure event) {
    JsonObject messageBody = JsonObject.mapFrom(event);
    vertx.eventBus().publish(busAddress, messageBody);
    LOG.debug("event scheduled");
  }


}
