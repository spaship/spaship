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
  afterEach(function () {
    cy.get("#userInfo").click();
    cy.get("#logout-button").click();
  });

  // test of new application creation, not recommand to use it
  // it('New a application and list it', function(){
  // cy.get('#add-application-button').click()
  // var test_name = 'name'+ NAME
  // var test_path = '/test'+'/'+NAME
  // var ref = 'v_qa_1.0.0'
  // cy.get('#name').type(test_name)
  // cy.get('select').select('QA')
  // cy.get('#path').type(test_path)
  // cy.get('#ref').type(ref)
  // cy.get('#upload').attachFile('test.tar')
  // cy.contains('Submit').click()
  // cy.get('#search-application-text').type(test_path)
  // cy.contains(test_name).should('exist')
  // })

  it("application list", function () {
    cy.get("#search-application-text").type(Cypress.env("app_path"));
    cy.contains(Cypress.env("app_path")).click();
  });

  //create and delete key
  it("API key generation -new / show/ delete", function () {
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
    cy.contains(key_name).should("exist");
    cy.contains(key_name).siblings('td[data-label="Scope"]').children("button").click();
    cy.contains("Revoke").click();
    cy.contains("Confirm").click();
    cy.contains(key_name).should("not.exist");
  });
});
