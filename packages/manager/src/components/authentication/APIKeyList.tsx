import React, { useState, useEffect, useCallback } from "react";
import Page from "../../layout/Page";
import APIKeyTable from "./APIKeyTable";
import APIKeyCreateModal from "./APIKeyCreateModal";
import { Button } from "@patternfly/react-core";
import { fetchAPIKeys } from "../../services/APIKeyService";
import { IAPIKey } from "../../models/APIKey";

export default () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [apiKeys, setAPIKeys] = useState<IAPIKey[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const keys = await fetchAPIKeys();
    setLoading(false);
    setAPIKeys(keys);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const afterCreated = (newAPIKeys: IAPIKey) => {
    setAPIKeys([...apiKeys, newAPIKeys]);
  };

  const afterDelete = (oldLabel: string) => {
    setAPIKeys(apiKeys.filter((item) => item.label !== oldLabel));
  };

  const titleToolbar = (
    <Button id="add-apikey-button" onClick={() => setModalOpen(true)}>
      Create API Key
    </Button>
  );
  return (
    <Page title="API Key Management" titleToolbar={titleToolbar}>
      <APIKeyCreateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} afterCreated={afterCreated} />
      <APIKeyTable apiKeys={apiKeys} afterDelete={afterDelete} isLoading={isLoading} />
    </Page>
  );
};
