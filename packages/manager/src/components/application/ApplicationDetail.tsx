import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import PrimaryDetails from "./PrimaryDetails";
import EnvironmentDetails from "./EnvironmentDetails";
import { Stack, StackItem } from "@patternfly/react-core";
import { IApplication } from "../../models/Application";
import { fetchApplication } from "../../services/ApplicationService";
import useConfig from "../../hooks/useConfig";

export default () => {
  const { applicationName } = useParams<{ applicationName: string }>();
  const [application, setApplication] = useState<IApplication>();
  const name = applicationName || "";
  const { selected } = useConfig();
  const environments = selected?.environments;

  const fetchData = useCallback(async (name, environments) => {
    const app = await fetchApplication(name, environments);
    setApplication(app);
  }, []);

  useEffect(() => {
    fetchData(name, environments);
  }, [fetchData, name, environments]);

  return (
    <Stack hasGutter>
      <StackItem>
        <PrimaryDetails application={application} />
      </StackItem>
      <StackItem>
        <EnvironmentDetails application={application} />
      </StackItem>
    </Stack>
  );
};
