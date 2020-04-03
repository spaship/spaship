window.SPAship = {
  environments: [
    {
      name: "Dev",
      api: "https://spaship-api-cpops-dev.ext.us-west.dc.preprod.paas.redhat.com/api/v1",
      domain: "https://access.dev.redhat.com",
    },
    {
      name: "QA",
      api: "https://spaship-api-cpops-qa.ext.us-west.dc.preprod.paas.redhat.com/api/v1",
      domain: "https://access.qa.redhat.com",
    },
    {
      name: "Stage",
      api: "https://spaship-api-cpops-stage.ext.us-west.dc.preprod.paas.redhat.com/api/v1",
      domain: "https://access.stage.redhat.com",
    },
    {
      name: "Prod",
      api: "https://spaship-api-cpops-prod.ext.us-west.dc.prod.paas.redhat.com/api/v1",
      domain: "https://access.redhat.com",
    },
  ],
  keycloak: {
    url: "https://auth.stage.redhat.com/auth",
    realm: "EmployeeIDP",
    clientId: "spaship-reference",
  },
};
