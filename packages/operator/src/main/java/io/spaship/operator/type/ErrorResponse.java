package io.spaship.operator.type;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
  String errorMessage;
  String errorCode;
  String documentationLink;

  @Override
  public String toString() {
    return "{"
      + "\"errorMessage\":\"" + errorMessage + "\""
      + ", \"errorCode\":\"" + errorCode + "\""
      + ", \"documentationLink\":\"" + documentationLink + "\""
      + "}";
  }
}
