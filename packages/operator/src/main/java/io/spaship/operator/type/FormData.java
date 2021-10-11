package io.spaship.operator.type;


import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import javax.ws.rs.core.MediaType;
import java.net.URI;
import java.nio.file.Path;
import java.util.Objects;

public class FormData {

  private static final String FILE_NOT_FOUND_MESSAGE = "file not received";

    @RestForm
    @PartType(MediaType.TEXT_PLAIN)
    public String description;

    @RestForm
    @PartType(MediaType.TEXT_PLAIN)
    public String website;

    @RestForm("spa")
    public FileUpload file;

    public String fileName() {
        Objects.requireNonNull(file,FILE_NOT_FOUND_MESSAGE);
        return this.file.fileName();
    }

    public Long fileSize() {
        Objects.requireNonNull(file,FILE_NOT_FOUND_MESSAGE);
        return this.file.size();
    }

    public String fileLocation() {
        Objects.requireNonNull(file,FILE_NOT_FOUND_MESSAGE);
        return this.file.uploadedFile().toString();
    }

    public URI getFileURI() {
        Objects.requireNonNull(file,FILE_NOT_FOUND_MESSAGE);
        return this.file.uploadedFile().toUri();
    }

    public Path getfilePath() {
        Objects.requireNonNull(file,FILE_NOT_FOUND_MESSAGE);
        return this.file.uploadedFile().toAbsolutePath();
    }

    public boolean isFileValid(){
      return this.file.contentType().contains("zip");
    }

}
