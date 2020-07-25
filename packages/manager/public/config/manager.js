window.SPAship = {
  configs: [
    {
      name: "access.redhat.com",
      isPreset: true,
      environments: [
        {
          name: "Dev",
          api: "https://spaship-api-cpops-dev.ext.us-west.dc.preprod.paas.redhat.com/api/v1",
          domain: "https://spaship-router-cpops-dev.ext.us-west.dc.preprod.paas.redhat.com",
        },
        {
          name: "QA",
          api: "https://spaship-api-cpops-qa.ext.us-west.dc.preprod.paas.redhat.com/api/v1",
          domain: "https://spaship-router-cpops-qa.ext.us-west.dc.preprod.paas.redhat.com",
        },
        {
          name: "Stage",
          api: "https://spaship-api-cpops-stage.ext.us-west.dc.preprod.paas.redhat.com/api/v1",
          domain: "https://spaship-router-cpops-stage.ext.us-west.dc.preprod.paas.redhat.com",
        },
        {
          name: "Prod",
          api: "https://spaship-api-cpops.ext.us-west.dc.prod.paas.redhat.com/api/v1",
          domain: "https://spaship-router-cpops.ext.us-west.dc.prod.paas.redhat.com",
        },
      ],
    },
  ],
};
