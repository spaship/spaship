describe("E2E happy test for SPAship manager", function () {
  var NAME;
  // SSO login
  before(() => {
    NAME = Cypress.moment().format("x");
  });
  // before each test will do sso login
  beforeEach(function () {
    cy.visit(Cypress.env("host"));
    cy.get("#username").type(Cypress.env("username"));
    cy.get("#password").type(Cypress.env("passw"));
    cy.get("#submit").click();
    cy.get("#root").should("exist");
    cy.log("SSO login successfully");
  });

  // after each test will do sso logout
  // afterEach(function () {
  // cy.get("#userInfo").click();
  // cy.get("#logout-button").click();
  // });

  it("API key generation -new", function () {
    var env_list = ["QA"];
    var key_name = "key" + NAME;
    cy.get('a[href*="authentication"]').click();
    cy.contains("Create API Key").click();
    cy.get("#api-key-label").type(key_name);
    cy.wrap(env_list).each((index) => {
      cy.get("#env-" + index).click();
    });
    cy.contains("Create API key").click();
    cy.get(".pf-c-input-group__text").each(($div, i, $divs) => {
      expect($divs).to.contain(env_list[i]);
    });
    cy.get('button[aria-label="Close"]').click();
  });

  it("API key delete", function () {
    var key_name = "key" + NAME;
    cy.get('a[href*="authentication"]').click();
    cy.contains(key_name).should("exist");
    cy.contains(key_name).siblings('td[data-label="Scope"]').children("button").click();
    cy.wait(10);
    cy.contains("Delete").click({ force: true });
    cy.contains("Confirm").click();
    cy.reload();
    cy.contains(key_name).should("not.exist");
  });

  it("new root application and router to display", function () {
    var deploy_evn = "Dev";
    cy.get("#add-application-button").click();
    var test_name = "name" + NAME;
    var ref = "v_qa_1.0.0";
    cy.get("#name").type(test_name);
    cy.get("select").select(deploy_evn);
    cy.get("#site-host").invoke("text").as("page1value");
    cy.get("#ref").type(ref);
    cy.get("#upload").attachFile("test.tar");
    cy.contains("Submit").click();
    cy.get("@page1value").then((value) => {
      cy.visit(value);
      cy.contains("This is test").should("exist");
    });
  });

  it("New a application and list it", function () {
    var deploy_evn = "Dev";
    cy.get("#add-application-button").click();
    var test_name = "name" + NAME;
    var test_path = "/test" + "/" + NAME;
    var ref = "v_qa_1.0.0";
    cy.get("#name").type(test_name);
    cy.get("select").select(deploy_evn);
    cy.get("#site-host").invoke("text").as("page1value");
    cy.get("#path").type(test_path);
    cy.get("#ref").type(ref);
    cy.get("#upload").attachFile("test.tar");
    cy.contains("Submit").click();
    cy.get("#search-application-text").type(test_path);
    cy.contains(test_name).should("exist");
    cy.contains(test_name).click();
    cy.get("h2").should("contain", test_name);
  });
  //
});
