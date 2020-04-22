require("cypress-file-upload");

describe("E2E happy test for SPAship manager", () => {
  const timestamp = Cypress.moment().format("x");
  // before each test will do sso login
  beforeEach(() => {
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

  it("API key generation -new", () => {
    const apiKey = {
      label: `key-${timestamp}`,
      environments: ["QA"],
    };
    cy.get('a[href*="authentication"]').click();
    cy.contains("Create API Key").click();
    cy.get("#api-key-label").type(apiKey.label);
    cy.wrap(apiKey.environments).each((index) => {
      cy.get("#env-" + index).click();
    });
    cy.contains("Create API key").click();
    cy.get(".pf-c-input-group__text").each(($div, i, $divs) => {
      expect($divs).to.contain(apiKey.environments[i]);
    });
    cy.get('button[aria-label="Close"]').click();
  });

  it("API key delete", () => {
    const apiKey = {
      label: `key-${timestamp}`,
    };
    cy.get('a[href*="authentication"]').click();
    cy.contains(apiKey.label).should("exist");
    cy.contains(apiKey.label).siblings('td[data-label="Scope"]').children("button").click();
    cy.contains("Delete").click({ force: true });
    cy.contains("Confirm").click();
    cy.reload();
    cy.contains(apiKey.label).should("not.exist");
  });

  it("new root application and router to display", () => {
    const spa = {
      name: `root-${timestamp}`,
      ref: `v1.0.0-${timestamp}`,
      environment: "Dev",
    };
    cy.get("#add-application-button").click();
    cy.get("#name").type(spa.name);
    cy.get("select").select(spa.environment);
    cy.get("#site-host").invoke("text").as("page1value");
    cy.get("#ref").type(spa.ref);
    cy.get("#upload").attachFile("test-spa.tgz");
    cy.contains("Submit").click();
    cy.get("@page1value").then((value) => {
      cy.visit(value);
      cy.contains("This is test").should("exist");
    });
  });

  it("New a application and list it", () => {
    const spa = {
      name: `test-${timestamp}`,
      path: `/test/${timestamp}`,
      ref: `v1.0.0-${timestamp}`,
      environment: "Dev",
    };

    cy.get("#add-application-button").click();
    cy.get("#name").type(spa.name);
    cy.get("select").select(spa.environment);
    cy.get("#site-host").invoke("text").as("page1value");
    cy.get("#path").type(spa.path);
    cy.get("#ref").type(spa.ref);
    cy.get("#upload").attachFile("test-spa.tgz");
    cy.contains("Submit").click();
    cy.get("#search-application-text").type(spa.path);
    cy.contains(spa.name).should("exist");
    cy.contains(spa.name).click();
    cy.get("h2").should("contain", spa.name);
  });
});
