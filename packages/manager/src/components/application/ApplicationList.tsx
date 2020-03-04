import React, { useState, useEffect } from "react";
import { Button, Level, LevelItem } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import Page from "../../layout/Page";
import config from "../../config";
import ApplicationFilter from "./ApplicationFilter";
import ApplicationTable from "./ApplicationTable";
import { IApplication } from "../../models/Application";

export default () => {
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    fetch(`${config.apiHost}/list`)
      .then(res => res.json())
      .then(apps => {
        apps.forEach((app: IApplication) => {
          app.environments = [
            {
              name: "Dev",
              deployHistory: [
                {
                  version: "1.1.0",
                  timestamp: new Date()
                }
              ]
            },
            {
              name: "QA",
              deployHistory: [
                {
                  version: "1.2.0",
                  timestamp: new Date()
                }
              ]
            }
          ];
        });
        setApplications(apps);
      });
  }, []);

  const handleKeywordChange = (changedKeywords: string) => {
    setKeywords(changedKeywords);
  };

  const environments = ["Dev", "QAs"];

  const toolbar = (
    <Level>
      <LevelItem>
        <ApplicationFilter onChange={handleKeywordChange} />
      </LevelItem>
      <LevelItem>
        <Link to={`/applications/new`}>
          <Button variant="primary">New Application</Button>
        </Link>
      </LevelItem>
    </Level>
  );

  return (
    <Page title="Applications" toolbar={toolbar}>
      <ApplicationTable
        applications={applications.filter(app => app.path && app.path.indexOf(keywords) !== -1)}
        environments={environments}
      />
    </Page>
  );
};
