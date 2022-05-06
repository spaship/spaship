package io.spaship.operator.util;

import io.spaship.operator.repo.SharedRepository;
import lombok.SneakyThrows;
import org.javatuples.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class ReUsableItems {
  private static final String SPASHIP_MAPPING_FILE = ".spaship";
  private static final Logger LOG = LoggerFactory.getLogger(ReUsableItems.class);


  private ReUsableItems() {
  }

  @SneakyThrows
  public static void blockFor(int timeInMs) {
    Thread.sleep(timeInMs);
  }


  public static String getSpashipMappingFileName() {
    return SPASHIP_MAPPING_FILE;
  }


  //lock environment creation operation for same website
  public static void enforceOpsLocking(Pair<String, UUID> blockDecisionFactors) {
    while (blockCall(blockDecisionFactors)) {
      LOG.debug("An environment creation/modification is in progress for this website {}",
        blockDecisionFactors.getValue0());
      ReUsableItems.blockFor(800);
    }
    SharedRepository.enqueue(blockDecisionFactors.getValue0(),
      new Pair<>(blockDecisionFactors.getValue1(), LocalDateTime.now()));
  }

  public static void releaseLock(String environmentName) {
    SharedRepository.dequeue(environmentName);
  }

  static boolean blockCall(Pair<String, UUID> decisionFactors) {
    String environmentId = decisionFactors.getValue0();
    UUID traceId = decisionFactors.getValue1();
    Pair<UUID, LocalDateTime> mapValue = SharedRepository.getEnvironmentLockMeta(environmentId);
    if (Objects.isNull(mapValue)) {
      LOG.warn("environmentLock not found!");
      return false;
    }
    LOG.debug("comparing {} with {}", decisionFactors, mapValue);

    return !SharedRepository.isQueued(environmentId)
      || !mapValue.getValue0().equals(traceId);
  }
}
