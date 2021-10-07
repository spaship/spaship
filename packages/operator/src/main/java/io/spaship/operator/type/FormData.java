package io.spaship.operator.type;


import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import javax.ws.rs.core.MediaType;
import java.net.URI;
import java.nio.file.Path;

public class FormData {

    @RestForm
    @PartType(MediaType.TEXT_PLAIN)
    public String description;

    @RestForm
    @PartType(MediaType.TEXT_PLAIN)
    public String website;

    @RestForm("spa")
    public FileUpload file;

    public String fileName() {
        return this.file.fileName();
    }

    public Long fileSize() {
        return this.file.size();
    }

    public String fileLocation() {
        return this.file.uploadedFile().toString();
    }

    public URI getFileURI() {
        return this.file.uploadedFile().toUri();
    }

    public Path getfilePath() {
        return this.file.uploadedFile().toAbsolutePath();
    }

}
