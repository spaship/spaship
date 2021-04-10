import { useState, useEffect, useCallback } from "react";
import { Button, Level, LevelItem } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import Page from "../../layout/Page";
import ApplicationFilter from "./ApplicationFilter";
import ApplicationTable from "./ApplicationTable";
import { IApplication } from "../../models/Application";
import { fetchApplications } from "../../services/ApplicationService";
import useConfig from "../../hooks/useConfig";

export default () => {
  const [applications, setApplications] = useState<IApplication[]>([]);

  const [keywords, setKeywords] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [hasAccess, setAccess] = useState(true);
  const { selected } = useConfig();
  const environments = selected?.environments;

  const fetchData = useCallback(async (environments) => {
    setLoading(true);
    const results = await fetchApplications(environments);
    const apps = results[0];
    const accessErr = results[1];
    if (apps) {setApplications(apps)};
    if (accessErr) {setAccess(false)};
    setLoading(false);
  }, []);

  useEffect(() => {
    if (environments) {
      fetchData(environments);
    }
  }, [fetchData, environments]);

  const handleKeywordChange = (changedKeywords: string) => {
    setKeywords(changedKeywords);
  };

  const titleToolbar = (
    <Level hasGutter>
      <LevelItem>
        <ApplicationFilter onChange={handleKeywordChange} />
      </LevelItem>
      <LevelItem>
        <Link to={`/applications/new`}>
          <Button isDisabled={!hasAccess} id="add-application-button" variant="primary">
            New Application
          </Button>
        </Link>
      </LevelItem>
    </Level>
  );

  return (
    <Page title="Applications" titleToolbar={titleToolbar}>
      <ApplicationTable
        isLoading={isLoading}
        hasAccess={hasAccess}
        environments={environments}
        applications={applications.filter((app) => app.path && app.path.indexOf(keywords) !== -1)}
      />
    </Page>
  );
};
