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
                            @Named("namespace") String nameSpace, EventManager eventManager) {
        this.k8sOperator = k8sOperator;
        this.sideCarOperations = sideCarOperations;
        this.nameSpace = nameSpace;
        this.eventManager = eventManager;
    }


    //[0]file-store-path[1]ops-tracing-id[2]website-name
    //TODO : simplify map blocks
    public void handleFileUpload(Triplet<Path, UUID, String> input) {
        LOG.debug("     deployment process initiated with details {}", input);

        Uni.createFrom()
                .item(() -> spaMappingIntoMemory(input))
                .runSubscriptionOn(executor)
                .map(this::buildEnvironmentList)
                .onItem()
                .transformToMulti(envList -> Multi.createFrom().iterable(envList))
                .map(env -> {
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
                })
                .map(opsResponse -> {
                    if (opsResponse.getStatus() == -1 || opsResponse.getStatus() == 0) {
                        LOG.debug("no operation performed");
                        return opsResponse;
                    }
                    sideCarOperations.asyncCreateOrUpdateSPDirectory(opsResponse);
                    return opsResponse;
                })
                .onFailure()
                .recoverWithItem(throwable -> {
                    throwable.printStackTrace();
                    return OperationResponse.builder().errorMessage(throwable.getLocalizedMessage()).build();
                })
                .subscribe()
                .with(operationResponse -> {
                    if (Objects.nonNull(operationResponse.getErrorMessage())) {
                        LOG.warn("operator file handling ops failed for env {} due to  {} ",
                                operationResponse.getEnvironmentName(), operationResponse.getErrorMessage());
                    } else {
                        LOG.info("operator file handling ops completed with response {}", operationResponse);
                    }

                });

    }

    private Triplet<String, UUID, Path> spaMappingIntoMemory(Triplet<Path, UUID, String> input) {
        Path absoluteFilePath = input.getValue0();
        LOG.debug("absolute absoluteFilePath is {}", absoluteFilePath);

        File spaDistribution = new File(absoluteFilePath.toUri());
        String spaMappingReference = null;
        assert spaDistribution.exists();
        try (ZipFile zipFile = new ZipFile(spaDistribution.getAbsolutePath())) {
            Enumeration<? extends ZipEntry> entries = zipFile.entries();
            InputStream inputStream = readFromSpaMapping(zipFile, entries);
            Objects.requireNonNull(inputStream, ReUsableItems.getSpashipMappingFileName() + " not found");
            try (inputStream) {
                spaMappingReference = IOUtils.toString(inputStream, Charset.defaultCharset());
            }
        } catch (IOException e) {
            eventManager.queue(
              EventStructure.builder()
                .websiteName(input.getValue2())
                .environmentName("NA")
                .uuid(input.getValue1())
                .state("failed to process zip file due to ".concat(e.getMessage()))
                .build()
            );
            throw new ZipFileProcessException(e);
        }
        eventManager.queue(
                EventStructure.builder()
                        .websiteName(input.getValue2())
                        .environmentName("NA")
                        .uuid(input.getValue1())
                        .state("mapping file loaded into memory")
                        .build());
        var output = new Triplet<>(spaMappingReference, input.getValue1(), input.getValue0());
        LOG.debug("output of spaMappingIntoMemory  {} ", output);
        return output;
    }

    private List<Environment> buildEnvironmentList(Triplet<String, UUID, Path> input) {
        SpashipMapping spaMapping = new SpashipMapping(input.getValue0());

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

    private Environment constructEnvironmentObject(Triplet<String, UUID, Path> input, SpashipMapping spaMapping,
                                                   HashMap<String, Object> environmentMapping) {
        var envName = environmentMapping.get("name").toString();
        var websiteName = spaMapping.getString("websiteName");
        var traceID = input.getValue1();
        var updateRestriction = (boolean) environmentMapping.get("updateRestriction");
        var zipFileLocation = input.getValue2();
        var websiteVersion = spaMapping.getWebsiteVersion();
        var spaName = spaMapping.getName();
        var spaContextPath = spaMapping.getContextPath();
        var branch = spaMapping.getBranch();
        var excludeFromEnvironment = (boolean) environmentMapping.get("exclude");

        Environment environment = new Environment(envName, websiteName, traceID, this.nameSpace, updateRestriction,
                zipFileLocation,
                websiteVersion, spaName, spaContextPath, branch, excludeFromEnvironment, false);
        LOG.debug("Constructed environment object is {}", environment);
        return environment;
    }

}
