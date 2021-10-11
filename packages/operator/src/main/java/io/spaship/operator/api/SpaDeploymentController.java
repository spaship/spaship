package io.spaship.operator.api;


import io.spaship.operator.business.SPAUploadHandler;
import io.spaship.operator.exception.ZipFileProcessException;
import io.spaship.operator.repo.SharedRepository;
import io.spaship.operator.type.FormData;
import org.javatuples.Pair;
import org.javatuples.Triplet;
import org.jboss.resteasy.reactive.MultipartForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Objects;
import java.util.UUID;

@Path("upload")
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
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public String uploadSPA(@MultipartForm FormData formData) {
        //[0]description[1]unique-trace-id
        var response = sanity(formData);
        //[0]file-path[1]unique-trace-id[2]website-name
        var fileUploadParams = new Triplet<>(formData.getfilePath(), response.getValue1(), formData.website);
        spaUploadHandlerService.handleFileUpload(fileUploadParams);
        return response.toString();
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


    private Pair<String, UUID> sanity(FormData formData) {

        if(!formData.isFileValid())
          throw new ZipFileProcessException("invalid file type");

        String description = formData.description;
        String fileName = formData.fileName();
        Long fileSize = formData.fileSize();
        java.nio.file.Path path = formData.getfilePath();

        Objects.requireNonNull(description, "description is missing from the request body");
        Objects.requireNonNull(fileName, "file name not found");
        Objects.requireNonNull(fileSize, "file size cannot be null");
        Objects.requireNonNull(path, "unable to store the file");

        LOG.debug("file received description {} , name is {} , size {}, location {} \n",
                description, fileName, fileSize, path);
        UUID processId = UUID.randomUUID();
        return new Pair<>(description, processId);
    }
}




