package io.spaship.operator.exception;

public class FeatureNotImplementedException extends RuntimeException {
  public FeatureNotImplementedException() {
    super("this feature is not implemented yet");
  }

  public FeatureNotImplementedException(String details) {
    super(details);
  }
}
