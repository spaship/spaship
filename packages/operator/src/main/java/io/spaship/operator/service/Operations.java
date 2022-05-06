package io.spaship.operator.service;

import io.spaship.operator.type.Environment;
import io.spaship.operator.type.OperationResponse;

public interface Operations {

  OperationResponse createOrUpdateEnvironment(Environment environment);


}
