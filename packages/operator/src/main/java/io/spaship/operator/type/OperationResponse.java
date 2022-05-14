package io.spaship.operator.type;

import java.nio.file.Path;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

public class OperationResponse {

  Environment environment;
  String sideCarServiceUrl;
  int status; //[-1] : restricted, [0] : skipped, [1] : created, [2] : modified, [3] : deleted
  String message;
  String errorMessage;
  String originatedFrom;

  OperationResponse(Environment environment, String sideCarServiceUrl, int status, String message, String errorMessage, String originatedFrom) {
    this.environment = environment;
    this.sideCarServiceUrl = sideCarServiceUrl;
    this.status = status;
    this.message = message;
    this.errorMessage = errorMessage;
    this.originatedFrom = originatedFrom;
  }

  public static OperationResponseBuilder builder() {
    return new OperationResponseBuilder();
  }

  public Environment getEnvironment() {
    return this.environment;
  }

  public String getContextPath() {
    return Optional.ofNullable(
        this.environment.getSpaContextPath()).orElse("NF"
      );
  }

  public String getSpaName() {
    if (Objects.isNull(this.environment))
      return "NF";
    return this.environment.getSpaName();
  }

  public String getEnvironmentName() {
    return environment.getName();
  }

  public String getSideCarServiceUrl() {
    return this.sideCarServiceUrl;
  }

  public int getStatus() {
    return this.status;
  }

  public String getMessage() {
    return this.message;
  }

  public String getErrorMessage() {
    return this.errorMessage;
  }

  public String getOriginatedFrom() {
    return this.originatedFrom;
  }

  @Override
  public String toString() {
    return "{"
      + "\"environment\":" + environment
      + ", \"sideCarServiceUrl\":\"" + sideCarServiceUrl + "\""
      + ", \"status\":\"" + status + "\""
      + ", \"message\":\"" + message + "\""
      + ", \"errorMessage\":\"" + errorMessage + "\""
      + ", \"originatedFrom\":" + originatedFrom
      + "}";
  }

  public Path filePath() {
    Objects.requireNonNull(environment, "environment object is null");
    Objects.requireNonNull(environment.getZipFileLocation(), "zip file location not found");
    return environment.getZipFileLocation();
  }

  public UUID traceId() {
    Objects.requireNonNull(environment, "environment object is null");
    Objects.requireNonNull(environment.getTraceID(), "trace-id not found");
    return environment.getTraceID();
  }

  public String spaName() {
    Objects.requireNonNull(environment, "environment object is null");
    Objects.requireNonNull(environment.getSpaName(), "SPA name not found");
    return environment.getSpaName();
  }

  public static class OperationResponseBuilder {
    private Environment environment;
    private String sideCarServiceUrl;
    private int status;
    private String message;
    private String errorMessage;
    private String originatedFrom;

    OperationResponseBuilder() {
    }

    public OperationResponseBuilder environment(Environment environment) {
      this.environment = environment;
      return this;
    }

    public OperationResponseBuilder sideCarServiceUrl(String sideCarServiceUrl) {
      this.sideCarServiceUrl = sideCarServiceUrl;
      return this;
    }

    public OperationResponseBuilder status(int status) {
      this.status = status;
      switch (status) {
        case -1:
          return message("restricted");
        case 0:
          return message("skipped");
        case 1:
          return message("created/accepted");
        case 2:
          return message("modified/ignored");
        case 3:
          return message("deleted");

        default:
          throw new IllegalStateException("Unexpected value: " + status);
      }
    }

    public OperationResponseBuilder message(String message) {
      this.message = message;
      return this;
    }

    public OperationResponseBuilder errorMessage(String errorMessage) {
      this.errorMessage = errorMessage;
      return this;
    }

    public OperationResponseBuilder originatedFrom(String originatedFrom) {
      this.originatedFrom = originatedFrom;
      return this;
    }

    public OperationResponse build() {
      return new OperationResponse(environment, sideCarServiceUrl, status, message, errorMessage, originatedFrom);
    }


    @Override
    public String toString() {
      return "{"
        + "\"environment\":" + environment
        + ", \"sideCarServiceUrl\":\"" + sideCarServiceUrl + "\""
        + ", \"status\":\"" + status + "\""
        + ", \"message\":\"" + message + "\""
        + ", \"errorMessage\":\"" + errorMessage + "\""
        + ", \"originatedFrom\":" + originatedFrom
        + "}";
    }
  }
}
