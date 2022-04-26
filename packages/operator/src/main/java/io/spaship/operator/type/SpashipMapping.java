package io.spaship.operator.type;

import io.vertx.core.json.JsonObject;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

/**
 * This is a specialised class for retrieving the .spaship mapping
 */
public class SpashipMapping extends JsonObject {

  // we dont need any constant because we know the property name matches with incoming json attributes
  String websiteVersion;
  String websiteName;
  List<HashMap<String, Object>> environments;
  //Name of the SPA
  String name;
  List<String> excludeFromEnvs;
  String branch;
  String contextPath;

  SpashipMapping() {
    super();
  }

  public SpashipMapping(String param) {
    super(param);
    init();
  }

  void init() {
    setWebsiteVersion();
    setWebsiteName();
    setEnvironments();
    setName();
    setExcludeFromEnvs();
    setBranch();
    setContextPath();
  }

  public String getWebsiteVersion() {
    return websiteVersion;
  }

  public void setWebsiteVersion() {
    this.websiteVersion = this.getString("websiteVersion");
  }

  public String getWebsiteName() {
    return websiteNameSanity(websiteName);
  }

  public void setWebsiteName() {
    this.websiteName = websiteNameSanity(this.getString("websiteName"));
  }

  public List<HashMap<String, Object>> getEnvironments() {
    return environments;
  }

  public void setEnvironments() {
    this.environments = this.getJsonArray("environments").getList();
  }

  public String getName() {
    return name;
  }

  public void setName() {
    this.name = this.getString("name");
  }

  public List<String> getExcludeFromEnvs() {
    return excludeFromEnvs;
  }

  public void setExcludeFromEnvs() {
    var array = this.getJsonArray("excludeFromEnvs");
    this.excludeFromEnvs = Objects.isNull(array) ? Collections.emptyList() : array.getList();
  }

  public String getBranch() {
    return branch;
  }

  public void setBranch() {
    this.branch = this.getString("branch");
  }

  public String getContextPath() {
    return contextPath;
  }

  public void setContextPath() {
    this.contextPath = this.getString("mapping");
  }

  @Override
  public boolean equals(Object o) {
    return super.equals(o);
  }

  @Override
  public int hashCode() {
    return super.hashCode();
  }

  private String websiteNameSanity(String websiteName) {
    var name = websiteName;
    if (Objects.isNull(name) || name.isEmpty() || name.isBlank())
      throw new NullPointerException("website name not found!");
    name = name.replaceAll(" ", "");
    return name;
  }
}
