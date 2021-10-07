package io.spaship.operator.exception;

public class FeatureNotImplemented extends RuntimeException {
    public FeatureNotImplemented() {
        super("this feature is not implemented yet");
    }

    public FeatureNotImplemented(String details) {
        super(details);
    }
}
