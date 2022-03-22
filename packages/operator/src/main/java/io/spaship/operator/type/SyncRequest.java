package io.spaship.operator.type;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SyncRequest {

  Environment environment;
  String syncConfiguration;

  @Override
  public String toString() {
    return "{"
      + "\"environment\":" + environment
      + ", \"syncConfiguration\":\"" + syncConfiguration + "\""
      + "}";
  }
}
