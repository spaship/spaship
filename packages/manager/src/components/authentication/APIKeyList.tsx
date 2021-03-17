import React, { useState, useEffect, useCallback } from "react";
import Page from "../../layout/Page";
import APIKeyTable from "./APIKeyTable";
import APIKeyCreateModal from "./APIKeyCreateModal";
import { Button } from "@patternfly/react-core";
import { fetchAPIKeys } from "../../services/APIKeyService";
import { IAPIKey } from "../../models/APIKey";
import useConfig from "../../hooks/useConfig";

export default () => {
  const { selected } = useConfig();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [apiKeys, setAPIKeys] = useState<IAPIKey[]>([]);
  const [hasAccess, setAccess] = useState(true)
  const selectedEnvs = selected?.environments || [];
  const environments = selectedEnvs;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const results = await fetchAPIKeys(environments);
    const keys = results[0];
    const accessErr = results[1]; 
    setLoading(false);
    if (keys) {setAPIKeys(keys)} ;
    if (accessErr) {setAccess(false)} ;
  }, [environments]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const afterCreated = (newAPIKeys: IAPIKey) => {
    setAPIKeys([...apiKeys, newAPIKeys]);
  };

  /**
   * After an API Key for an environment is deleted update the API Keys list by deleting the environment entry
   * from the old key by comparing the Label and Environment. In case there is only one environment within the
   * API Key item, remove the entire item.
   **/

  const afterDelete = (oldEnvironment: string, oldLabel: string) => {
    const updatedAPIKeys = apiKeys.filter((item) => {
      if (item.label === oldLabel) {
        item.environments = item.environments.filter((env) => env.name !== oldEnvironment);
        return item.environments.length ? item : false;
      } else return item;
    });
    setAPIKeys(updatedAPIKeys);
  };

  const titleToolbar = (
    <Button isDisabled={!hasAccess} id="add-apikey-button" onClick={() => setModalOpen(true)} disabled>
      Create API Key
    </Button>
  );
  return (
    <Page title="API Key Management" titleToolbar={titleToolbar}>
      <APIKeyCreateModal
        apiKeys={apiKeys}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        afterCreated={afterCreated}
      />
      <APIKeyTable apiKeys={apiKeys} afterDelete={afterDelete} isLoading={isLoading} hasAccess={hasAccess}/>
    </Page>
  );
};
