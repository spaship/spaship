package io.spaship.operator.type;

import java.time.LocalDateTime;

public class EventStructure {
  private final LocalDateTime dateTime;
  private String uuid;
  private String websiteName;
  private String environmentName;
  private String state;
  private String spaName;
  private String contextPath;

  EventStructure(String uuid, String websiteName, String environmentName, String state, String spaName,String contextPath) {
    this.uuid = uuid;
    this.websiteName = websiteName;
    this.environmentName = environmentName;
    this.state = state;
    this.spaName = spaName;
    this.dateTime = LocalDateTime.now();
    this.contextPath = contextPath;
  }

  public static EventStructureBuilder builder() {
    return new EventStructureBuilder();
  }

  public String getUuid() {
    return this.uuid;
  }

  public void setUuid(java.util.UUID uuid) {
    this.uuid = uuid.toString();
  }

  public String getWebsiteName() {
    return this.websiteName;
  }

  public void setWebsiteName(String websiteName) {
    this.websiteName = websiteName;
  }

  public String getEnvironmentName() {
    return this.environmentName;
  }

  public void setEnvironmentName(String environmentName) {
    this.environmentName = environmentName;
  }

  public String getState() {
    return this.state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public String getSpaName() {
    return spaName;
  }

  public void setSpaName(String spaName) {
    this.spaName = spaName;
  }

  public LocalDateTime getDateTime() {
    return dateTime;
  }

  public String getContextPath() {
    return contextPath;
  }

  public void setContextPath(String contextPath) {
    this.contextPath = contextPath;
  }

  @Override
  public String toString() {
    return "{"
      + "\"dateTime\":" + dateTime
      + ", \"uuid\":\"" + uuid + "\""
      + ", \"websiteName\":\"" + websiteName + "\""
      + ", \"environmentName\":\"" + environmentName + "\""
      + ", \"state\":\"" + state + "\""
      + ", \"spaName\":\"" + spaName + "\""
      + ", \"contextPath\":\"" + contextPath + "\""
      + "}";
  }

  public static class EventStructureBuilder {
    private String uuid;
    private String websiteName;
    private String environmentName;
    private String state;
    private String spaName;
    private String contextPath;

    EventStructureBuilder() {
    }

    public EventStructureBuilder uuid(java.util.UUID uuid) {
      this.uuid = uuid.toString();
      return this;
    }

    public EventStructureBuilder websiteName(String websiteName) {
      this.websiteName = websiteName;
      return this;
    }

    public EventStructureBuilder environmentName(String environmentName) {
      this.environmentName = environmentName;
      return this;
    }

    public EventStructureBuilder state(String state) {
      this.state = state;
      return this;
    }

    public EventStructureBuilder spaName(String spaName) {
      this.spaName = spaName;
      return this;
    }

    public EventStructureBuilder contextPath(String contextPath) {
      this.contextPath = contextPath;
      return this;
    }

    public EventStructure build() {
      return new EventStructure(uuid, websiteName, environmentName, state, spaName,contextPath);
    }

    @Override
    public String toString() {
      return "{"
        + "\"uuid\":\"" + uuid + "\""
        + ", \"websiteName\":\"" + websiteName + "\""
        + ", \"environmentName\":\"" + environmentName + "\""
        + ", \"state\":\"" + state + "\""
        + ", \"spaName\":\"" + spaName + "\""
        + ", \"contextPath\":\"" + contextPath + "\""
        + "}";
    }
  }
}
