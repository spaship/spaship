package io.spaship.operator.api;


import io.quarkus.security.Authenticated;
import io.spaship.operator.business.SPAUploadHandler;
import io.spaship.operator.exception.ValidationException;
import io.spaship.operator.repo.SharedRepository;
import io.spaship.operator.type.FormData;
import io.vertx.core.json.JsonObject;
import org.javatuples.Pair;
import org.javatuples.Triplet;
import org.jboss.resteasy.reactive.MultipartForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Path("upload")
@Authenticated
public class SpaDeploymentController {

  private static final Logger LOG = LoggerFactory.getLogger(SpaDeploymentController.class);
  private final SPAUploadHandler spaUploadHandlerService;

  public SpaDeploymentController(SPAUploadHandler spaUploadHandlerService) {
    this.spaUploadHandlerService = spaUploadHandlerService;
  }

  @Produces("text/plain")
  @GET
  public String upload() {
    return "please post a spa zip in the same url to make it work";
  }

  @POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  public String uploadSPA(@MultipartForm FormData formData) {
    //[0]description[1]unique-trace-id
    sanity(formData);
    var response = requestTagging(formData.website);
    //[0]file-path[1]unique-trace-id[2]website-name
    var fileUploadParams = new Triplet<>(formData.getfilePath(), response, formData.website);
    spaUploadHandlerService.handleFileUpload(fileUploadParams);
    JsonObject object = new JsonObject();
    object.put("description", response.getValue0());
    object.put("traceId", response.getValue1());
    return object.toString();
  }

  @GET
  @Path("/test-exception")
  @Produces("application/json")
  public String exception() {
    throw new IllegalStateException("my custom illegal exception");
  }


  @GET
  @Path("/dequeue/{website}")
  @Produces("text/plain")
  public Boolean dequeue(@PathParam("website") String website) {
    return SharedRepository.dequeue(website);
  }


  private void sanity(FormData formData) {

    if (!formData.isFileValid())
      throw new ValidationException("invalid file type");

    String description = formData.description;
    String fileName = formData.fileName();
    Long fileSize = formData.fileSize();
    String website = formData.website;
    java.nio.file.Path path = formData.getfilePath();

    if (Objects.isNull(description) || description.isEmpty() || description.isBlank()){
      LOG.warn("description field value is not set");
      description = String.valueOf(LocalDateTime.now());
    }


    Objects.requireNonNull(fileName, "file name not found");
    Objects.requireNonNull(fileSize, "file size is not set");
    Objects.requireNonNull(path, "no path found");
    Objects.requireNonNull(website, "website attribute is not set");


    if (website.isEmpty() || website.isBlank())
      throw new ValidationException("website attribute is empty");

    LOG.debug("FormData attributes after transformation  description {} , name is {} , size {}, location {} \n",
      description, fileName, fileSize, path);
    formData.description = description;
  }

  private Pair<String, UUID> requestTagging(String param){
    UUID processId = UUID.randomUUID();
    return new Pair<>(param, processId);
  }
}




