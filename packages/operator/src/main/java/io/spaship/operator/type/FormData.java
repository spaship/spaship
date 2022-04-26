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
    validateFileUpload();
    return this.file.fileName();
  }

  public Long fileSize() {
    validateFileUpload();
    return this.file.size();
  }

  public String fileLocation() {
    validateFileUpload();
    return this.file.uploadedFile().toString();
  }

  public URI getFileURI() {
    validateFileUpload();
    return this.file.uploadedFile().toUri();
  }

  public Path getfilePath() {
    validateFileUpload();
    return this.file.uploadedFile().toAbsolutePath();
  }

  public boolean isFileValid() {
    validateFileUpload();
    Objects.requireNonNull(file.contentType(), "no content found!");
    return this.file.contentType().contains("zip");
  }

  private void validateFileUpload() {
    Objects.requireNonNull(file, FILE_NOT_FOUND_MESSAGE);
  }

}
