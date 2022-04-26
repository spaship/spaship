package io.spaship.operator.service;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Enumeration;
import java.util.Objects;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

//@QuarkusTest
class SPAUploadHandlerTest {

  private static final Logger LOG = LoggerFactory.getLogger(SPAUploadHandlerTest.class);
  String absolutePathOfTestFile = "/home/arkaprovo/IdeaProjects/spa-deployment-operator/src/test/resources/large-dir.zip";


  private void pathToFileWayOne() throws URISyntaxException, IOException {

    File spaDistribution = new File(absolutePathOfTestFile);
    assert spaDistribution.exists();
    ZipFile zipFile = new ZipFile(spaDistribution.getAbsolutePath());
    Enumeration<? extends ZipEntry> entries = zipFile.entries();


    LocalDateTime start = LocalDateTime.now();
    LOG.debug("started at {}", start);
    InputStream inputStream = Collections
      .list(entries)
      .parallelStream()
      .filter(file -> file.getName().equals(".spaship"))
      .findFirst().map(entry -> {
        try {
          LOG.debug("file loaded into memory");
          return zipFile.getInputStream(entry);
        } catch (IOException e) {
          throw new RuntimeException(e.getMessage());
        }
      }).orElse(null);

    Objects.requireNonNull(inputStream, ".spaship not found");
    String spaMapping;
    try (inputStream) {
      spaMapping = IOUtils.toString(inputStream, Charset.defaultCharset());
    }

    LocalDateTime end = LocalDateTime.now();
    LOG.debug("ended {}", end);
    var difference = Duration.between(start, end).toMillis();
    LOG.debug(".spaship content is {}", spaMapping);
    LOG.debug("time taken {}", difference);

  }

  private void pathToFileWayTwo() throws URISyntaxException, IOException {

    File spaDistribution = new File(absolutePathOfTestFile);
    assert spaDistribution.exists();
    ZipFile zipFile = new ZipFile(spaDistribution.getAbsolutePath());
    Enumeration<? extends ZipEntry> entries = zipFile.entries();


    LocalDateTime start = LocalDateTime.now();
    LOG.debug("started at {}", start);
    InputStream inputStream = Collections
      .list(entries)
      .stream()
      .filter(file -> file.getName().equals(".spaship"))
      .findFirst().map(entry -> {
        try {
          LOG.debug("file loaded into memory");
          return zipFile.getInputStream(entry);
        } catch (IOException e) {
          throw new RuntimeException(e.getMessage());
        }
      }).orElse(null);

    Objects.requireNonNull(inputStream, ".spaship not found");
    String spaMapping;
    try (inputStream) {
      spaMapping = IOUtils.toString(inputStream, Charset.defaultCharset());
    }

    LocalDateTime end = LocalDateTime.now();
    LOG.debug("ended {}", end);
    var difference = Duration.between(start, end).toMillis();
    LOG.debug(".spaship content is {}", spaMapping);
    LOG.debug("time taken {}", difference);

  }

  //@Test
  void readZipFileOne() throws URISyntaxException, IOException {
    pathToFileWayOne();
  }

  //@Test
  void readZipFileTwo() throws URISyntaxException, IOException {
    pathToFileWayTwo();
  }
}
