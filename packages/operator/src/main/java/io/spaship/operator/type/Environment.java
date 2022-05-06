package io.spaship.operator.type;

import java.nio.file.Path;
import java.util.UUID;

public class Environment {

  private String name;
  private String websiteName;
  private UUID traceID;
  private String nameSpace;
  private boolean updateRestriction;
  private Path zipFileLocation;
  private String websiteVersion;
  private String spaName;
  private String spaContextPath;
  private String branch;
  private boolean excludeFromEnvironment; //to create or not to create :P
  private boolean operationPerformed = false; // for flagging purpose, to know whether any k8s operation is performed
  private String identification;


  public Environment(String name, String websiteName, UUID traceID, String nameSpace, boolean updateRestriction,
                     Path zipFileLocation, String websiteVersion, String spaName, String spaContextPath,
                     String branch, boolean excludeFromEnvironment, boolean operationPerformed) {
    this.name = replaceSpecialCharacters(name);
    this.websiteName = websiteName;
    this.traceID = traceID;
    this.nameSpace = nameSpace;
    this.updateRestriction = updateRestriction;
    this.zipFileLocation = zipFileLocation;
    this.websiteVersion = websiteVersion;
    this.spaName = spaName;
    this.spaContextPath = spaContextPath;
    this.branch = branch;
    this.excludeFromEnvironment = excludeFromEnvironment;
    this.operationPerformed = operationPerformed;
    this.identification = getWebsiteName().concat("-").concat(name);
  }

  public String getName() {
    return replaceSpecialCharacters(this.name);
  }

  public void setName(String name) {
    this.name = replaceSpecialCharacters(name);
  }

  private String replaceSpecialCharacters(String entry) {
    var refactoredVariable = entry.replace("_", "-");
    refactoredVariable = refactoredVariable.replace(".", "-");
    refactoredVariable = refactoredVariable.replace("@", "-");
    refactoredVariable = refactoredVariable.replaceAll(" ", "");
    return refactoredVariable;
  }

  public String getWebsiteName() {
    this.websiteName = websiteName.replace(".", "-");
    this.websiteName = websiteName.replace("_", "-");
    return this.websiteName;
  }

  public void setWebsiteName(String websiteName) {
    this.websiteName = websiteName;
  }

  public UUID getTraceID() {
    return this.traceID;
  }

  public void setTraceID(UUID traceID) {
    this.traceID = traceID;
  }

  public String getNameSpace() {
    return this.nameSpace;
  }

  public void setNameSpace(String nameSpace) {
    this.nameSpace = nameSpace;
  }

  public boolean isUpdateRestriction() {
    return this.updateRestriction;
  }

  public void setUpdateRestriction(boolean updateRestriction) {
    this.updateRestriction = updateRestriction;
  }

  public Path getZipFileLocation() {
    return this.zipFileLocation;
  }

  public void setZipFileLocation(Path zipFileLocation) {
    this.zipFileLocation = zipFileLocation;
  }

  public String getWebsiteVersion() {
    return this.websiteVersion;
  }

  public void setWebsiteVersion(String websiteVersion) {
    this.websiteVersion = websiteVersion;
  }

  public String getSpaName() {
    return this.spaName;
  }

  public void setSpaName(String spaName) {
    this.spaName = spaName;
  }

  public String getSpaContextPath() {
    return this.spaContextPath;
  }

  public void setSpaContextPath(String spaContextPath) {
    this.spaContextPath = spaContextPath;
  }

  public String getBranch() {
    return this.branch;
  }

  public void setBranch(String branch) {
    this.branch = branch;
  }

  public boolean isExcludeFromEnvironment() {
    return this.excludeFromEnvironment;
  }

  public void setExcludeFromEnvironment(boolean excludeFromEnvironment) {
    this.excludeFromEnvironment = excludeFromEnvironment;
  }

  public boolean isOperationPerformed() {
    return this.operationPerformed;
  }

  public void setOperationPerformed(boolean operationPerformed) {
    this.operationPerformed = operationPerformed;
  }

  public String getIdentification() {
    return this.identification;
  }

  public void setIdentification(String identification) {
    this.identification = identification;
  }

  @Override
  public String toString() {
    return "{"
      + "\"name\":\"" + name + "\""
      + ", \"websiteName\":\"" + websiteName + "\""
      + ", \"traceID\":" + traceID
      + ", \"nameSpace\":\"" + nameSpace + "\""
      + ", \"updateRestriction\":\"" + updateRestriction + "\""
      + ", \"zipFileLocation\":" + zipFileLocation
      + ", \"websiteVersion\":\"" + websiteVersion + "\""
      + ", \"spaName\":\"" + spaName + "\""
      + ", \"spaContextPath\":\"" + spaContextPath + "\""
      + ", \"branch\":\"" + branch + "\""
      + ", \"excludeFromEnvironment\":\"" + excludeFromEnvironment + "\""
      + ", \"operationPerformed\":\"" + operationPerformed + "\""
      + ", \"identification\":\"" + identification + "\""
      + "}";
  }
}
