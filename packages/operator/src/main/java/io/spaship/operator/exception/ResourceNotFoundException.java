package io.spaship.operator.exception;

public class ResourceNotFoundException extends RuntimeException {
  public ResourceNotFoundException() {
    super();
  }

  public ResourceNotFoundException(String resourceName) {
    super("resource " + resourceName + " not found in namespace");
  }
}
