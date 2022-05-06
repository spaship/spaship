package io.spaship.operator.exception;

public class ZipFileProcessException extends RuntimeException {

  public ZipFileProcessException(String message) {
    super(message);
  }

  public ZipFileProcessException() {
    super();
  }

  public ZipFileProcessException(Throwable cause) {
    super(cause);
  }
}
