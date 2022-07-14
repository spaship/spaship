package io.spaship.operator.business;

import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.infrastructure.Infrastructure;
import io.spaship.operator.exception.ZipFileProcessException;
import io.spaship.operator.service.k8s.Operator;
import io.spaship.operator.service.k8s.SideCarOperations;
import io.spaship.operator.type.Environment;
import io.spaship.operator.type.EventStructure;
import io.spaship.operator.type.OperationResponse;
import io.spaship.operator.type.SpashipMapping;
import io.spaship.operator.util.ReUsableItems;
import org.apache.commons.io.IOUtils;
import org.javatuples.Pair;
import org.javatuples.Triplet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Named;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

@ApplicationScoped
public class SPAUploadHandler {

  private static final Logger LOG = LoggerFactory.getLogger(SPAUploadHandler.class);
  private final Executor executor = Infrastructure.getDefaultExecutor();
  private final Operator k8sOperator;
  private final SideCarOperations sideCarOperations;
  private final String nameSpace;
  private final EventManager eventManager;

  public SPAUploadHandler(Operator k8sOperator, SideCarOperations sideCarOperations,
                          @Named("defaultNamespaceMT") String nameSpace, EventManager eventManager) {
    this.k8sOperator = k8sOperator;
    this.sideCarOperations = sideCarOperations;
    this.nameSpace = nameSpace;
    this.eventManager = eventManager;
  }


  //[0]file-store-path[1]ops-tracing-id[2]website-name
  public void handleFileUpload(Triplet<Path, Pair<String, UUID>, String> input) {
    LOG.debug("     deployment process initiated with details {}", input);

    Uni.createFrom()
      .item(() -> spaMappingIntoMemory(input))
      .runSubscriptionOn(executor)
      .map(this::buildEnvironmentList)
      .onItem()
      .transformToMulti(envList -> Multi.createFrom().iterable(envList))
      .map(this::processEnvironment)
      .map(this::createOrUpdateSPA)
      .onFailure()
      .recoverWithItem(throwable -> {
        throwable.printStackTrace();
        return OperationResponse.builder().errorMessage(throwable.getLocalizedMessage()).build();
      })
      .subscribe()
      .with(this::logOperationDetails);

  }

  private Triplet<SpashipMapping, UUID, Path> spaMappingIntoMemory(Triplet<Path, Pair<String, UUID>, String> input) {
    Path absoluteFilePath = input.getValue0();
    LOG.debug("absolute absoluteFilePath is {}", absoluteFilePath);
    SpashipMapping spaMapping;

    File spaDistribution = new File(absoluteFilePath.toUri());
    assert spaDistribution.exists();
    try (ZipFile zipFile = new ZipFile(spaDistribution.getAbsolutePath())) {
      Enumeration<? extends ZipEntry> entries = zipFile.entries();
      InputStream inputStream = readFromSpaMapping(zipFile, entries);
      Objects.requireNonNull(inputStream, ReUsableItems.getSpashipMappingFileName() + " not found");
      spaMapping = mappingFileToObject(inputStream);
    } catch (Exception e) {
      eventManager.queue(EventStructure.builder()
        .websiteName(input.getValue2())
        .environmentName("NA")
        .uuid(input.getValue1().getValue1())
        .state("failed to process zip file due to ".concat(e.getMessage()))
        .spaName(input.getValue1().getValue0())
        .contextPath("NF")
        .build()
      );
      throw new ZipFileProcessException(e);
    }
    queueEvent(input, spaMapping);
    var output = new Triplet<>(spaMapping, input.getValue1().getValue1(), input.getValue0());
    LOG.debug("output of spaMappingIntoMemory  {} ", output);
    return output;
  }

  private void queueEvent(Triplet<Path, Pair<String, UUID>, String> input, SpashipMapping spaMapping) {
    eventManager.queue(EventStructure.builder()
      .websiteName(input.getValue2())
      .environmentName("NA")
      .uuid(input.getValue1().getValue1())
      .state("mapping file loaded into memory")
      .spaName(input.getValue1().getValue0())
      .contextPath(Objects.isNull(spaMapping) ? "NF" : spaMapping.getContextPath())
      .build());
  }

  private SpashipMapping mappingFileToObject(InputStream inputStream) throws IOException {
    SpashipMapping spaMapping;
    String spaMappingReference;
    try (inputStream) {
      spaMappingReference = IOUtils.toString(inputStream, Charset.defaultCharset());
      spaMapping = mappingFromString(spaMappingReference);
    }
    return spaMapping;
  }

  public SpashipMapping mappingFromString(String input) {
    SpashipMapping spaMapping;
    try {
      spaMapping = new SpashipMapping(input);
    } catch (Exception e) {
      LOG.error("failed to parse SpashipMapping, please check the .sapship file, error message {}", e.getMessage());
      return null;
    }

    return spaMapping;
  }

  private List<Environment> buildEnvironmentList(Triplet<SpashipMapping, UUID, Path> input) {
    SpashipMapping spaMapping = input.getValue0();

    if (Objects.isNull(spaMapping)) {
      eventManager.queue(EventStructure.builder()
        .websiteName("NF")
        .environmentName("NA")
        .uuid(input.getValue1())
        .state("failed to parse .spaship file, check app log")
        .build());
      return Collections.emptyList();
    }

    var environments = spaMapping.getEnvironments();
    var environmentSize = environments.size();
    LOG.debug("{} no of environments detected and first entry is {}", environmentSize, environments.get(0));

    List<Environment> allEnvironments = environments.stream()
      .map(environmentMapping -> constructEnvironmentObject(input, spaMapping, environmentMapping))
      .collect(Collectors.toList());

    assert environmentSize == allEnvironments.size();

    eventManager.queue(
      EventStructure.builder()
        .websiteName(spaMapping.getWebsiteName())
        .environmentName("NA")
        .uuid(input.getValue1())
        .state("environments detected")
        .build());

    return allEnvironments;
  }


//************************************************ Lambda inner Methods ************************************************

  private InputStream readFromSpaMapping(ZipFile zipFile, Enumeration<? extends ZipEntry> entries) {
    LOG.debug("reading from .spaship input stream");
    return Collections
      .list(entries)
      .stream()
      .filter(file -> file.getName().equals(ReUsableItems.getSpashipMappingFileName()))
      .findFirst().map(entry -> {
        try {
          LOG.debug("file loaded into memory");
          return zipFile.getInputStream(entry);
        } catch (IOException e) {
          LOG.error("failed to load content into input-stream");
          return null;
        }
      }).orElse(null);
  }

  private Environment constructEnvironmentObject(Triplet<SpashipMapping, UUID, Path> input, SpashipMapping spaMapping,
                                                 HashMap<String, Object> environmentMapping) {
    var envName = environmentMapping.get("name").toString();
    var websiteName = Objects.isNull(spaMapping.getWebsiteName()) ?
      spaMapping.getString("websiteName") : spaMapping.getWebsiteName();
    var traceID = input.getValue1();
    var updateRestriction = (boolean) environmentMapping.get("updateRestriction");
    var zipFileLocation = input.getValue2();
    var websiteVersion = spaMapping.getWebsiteVersion();
    var spaName = spaMapping.getName();
    var spaContextPath = spaMapping.getContextPath();
    var branch = spaMapping.getBranch();
    var excludeFromEnvironment = (boolean) environmentMapping.get("exclude");
    var ns = Optional.ofNullable(environmentMapping.get("ns")).orElse(this.nameSpace);

    Environment environment = new Environment(envName, websiteName, traceID, (String) ns, updateRestriction,
      zipFileLocation,
      websiteVersion, spaName, spaContextPath, branch, excludeFromEnvironment, false);
    LOG.debug("Constructed environment object is {}", environment);
    return environment;
  }


  private OperationResponse createOrUpdateSPA(OperationResponse opsResponse) {
    if (opsResponse.getStatus() == -1 || opsResponse.getStatus() == 0) {
      LOG.debug("no operation performed");
      return opsResponse;
    }
    sideCarOperations.asyncCreateOrUpdateSPDirectory(opsResponse);
    return opsResponse;
  }

  private void logOperationDetails(OperationResponse operationResponse) {
    if (Objects.nonNull(operationResponse.getErrorMessage())) {
      LOG.warn("operator file handling ops failed for env {} due to  {} ",
        operationResponse.getEnvironmentName(), operationResponse.getErrorMessage());
    } else {
      LOG.info("operator file handling ops completed with response {}", operationResponse);
    }
  }

  private OperationResponse processEnvironment(Environment env) {
    if (env.isUpdateRestriction() && k8sOperator.environmentExists(env)) {
      LOG.debug("environment exists but update restriction enforced, " +
        "environment details are as follows {}", env);
      return OperationResponse.builder().environment(env).status(-1).originatedFrom(this.getClass().toString())
        .build();
    }

    if (env.isExcludeFromEnvironment() && k8sOperator.environmentExists(env)) {
      LOG.debug("environment exists but env exclusion enforced, " +
        "environment details are as follows {}", env);
      return k8sOperator.removeSPA(env);
    }

    if (env.isExcludeFromEnvironment()) {
      LOG.debug("env exclusion enforced, skipping any operation, the environment details are as " +
        "follows {}", env);
      return OperationResponse.builder().environment(env).status(0).originatedFrom(this.getClass().toString())
        .build();
    }

    return k8sOperator.createOrUpdateEnvironment(env);
  }

}
