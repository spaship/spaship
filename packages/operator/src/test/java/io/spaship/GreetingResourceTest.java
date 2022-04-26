package io.spaship;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

//@QuarkusTest
public class GreetingResourceTest {

  //@Test
  public void testHelloEndpoint() {
    given()
      .when().get("/api/hello")
      .then()
      .statusCode(200)
      .body(is("Hello RESTEasy"));
  }

}
