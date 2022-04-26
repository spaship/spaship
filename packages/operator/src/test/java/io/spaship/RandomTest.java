package io.spaship;

import io.smallrye.mutiny.Multi;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RandomTest {

  private static final Logger LOG = LoggerFactory.getLogger(RandomTest.class);

  @Test
  public void testMulti() {

    Multi.createFrom().items(1, 2, 3, 4, 5, 6, 7, 8, 9)
      .onItem()
      .invoke(item -> {
        System.out.println("per " + item + " thread " + Thread.currentThread().getName());
        item = item * 10;
      }).map(item -> {
        if (item == 5) {
          //throw new RuntimeException("congratz its an error");
        }
        System.out.println("second mapping chain, Thread " + Thread.currentThread().getName());
        return item * 10;
      }).onFailure()
      .recoverWithItem(11)
      .onSubscription().invoke(() -> {
        try {
          Thread.sleep(2000);
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
        System.out.println("subscribed " + Thread.currentThread().getName());
      }).subscribe()
      .with(item -> System.out.println("consuming  " + item + " from " + Thread.currentThread().getName()));

    //scb.onComplete();
  }


  @Test
  public void testSplit() {

    String url = "http://172.30.48.16:8081";
    String[] urlsPart = url.split(":");
    System.out.println(urlsPart[0]);
    System.out.println(urlsPart[1].replace("//", ""));
    System.out.println(urlsPart[2]);
    assert urlsPart.length == 3;


  }

}
