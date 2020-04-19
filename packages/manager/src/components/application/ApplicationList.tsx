import React, { useState, useEffect, useCallback } from "react";
import { Button, Level, LevelItem } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import Page from "../../layout/Page";
import config from "../../config";
import ApplicationFilter from "./ApplicationFilter";
import ApplicationTable from "./ApplicationTable";
import { IApplication } from "../../models/Application";
import { fetchApplications } from "../../services/ApplicationService";

export default () => {
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [keywords, setKeywords] = useState("");
  const [isLoading, setLoading] = useState(false);
  const environments = config.environments;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const apps = await fetchApplications();
    setApplications(apps);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleKeywordChange = (changedKeywords: string) => {
    setKeywords(changedKeywords);
  };

  const toolbar = (
    <Level>
      <LevelItem>
        <ApplicationFilter onChange={handleKeywordChange} />
      </LevelItem>
      <LevelItem>
        <Link to={`/applications/new`}>
          <Button id="add-application-button" variant="primary">
            New Application
          </Button>
        </Link>
      </LevelItem>
    </Level>
  );

  return (
    <Page title="Applications" toolbar={toolbar}>
      <ApplicationTable
        isLoading={isLoading}
        applications={applications.filter((app) => app.path && app.path.indexOf(keywords) !== -1)}
        environments={environments}
      />
    </Page>
  );
};
