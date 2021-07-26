window.SPAship = {
  configs: [
    {
      name: "one.redhat.com",
      isPreset: true,
      environments: [
        {
          name: "Dev",
          api: "http://localhost:2345/api/v1",
          domain: "http://localhost:8765",
        },
      ],
    },
  ],
};
