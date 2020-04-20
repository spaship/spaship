import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import PrimaryDetails from "./PrimaryDetails";
import EnvironmentDetails from "./EnvironmentDetails";
import { Stack, StackItem } from "@patternfly/react-core";
import { IApplication } from "../../models/Application";
import { fetchApplication } from "../../services/ApplicationService";

export default () => {
  const { applicationName } = useParams();
  const [application, setApplication] = useState<IApplication>();
  const name = applicationName || "";

  const fetchData = useCallback(async () => {
    const app = await fetchApplication(name);
    setApplication(app);
  }, [name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Stack gutter="md">
      <StackItem>
        <PrimaryDetails application={application} />
      </StackItem>
      <StackItem>
        <EnvironmentDetails application={application} />
      </StackItem>
    </Stack>
  );
};
