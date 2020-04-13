import React, { useState, useEffect } from "react";
import isEqual from "lodash/isEqual";
import Page from "../../layout/Page";
import APIKeyTable from "./APIKeyTable";
import APIKeyCreateModal from "./APIKeyCreateModal";
import { Button } from "@patternfly/react-core";
import config from "../../config";
import * as APIService from "../../services/APIService";
import { IAPIKey } from "../../models/APIKey";

export default () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [apiKeys, setAPIKeys] = useState<IAPIKey[]>([]);

  const environments = config.environments;
  useEffect(() => {
    APIService.getAllEnvironmentAPIKeyList(environments).then((keys) => {
      setAPIKeys(keys);
    });
  }, [environments]);

  const afterCreated = (newAPIKeys: IAPIKey[]) => {
    setAPIKeys(apiKeys.concat(newAPIKeys));
  };

  const afterDelete = (oldAPIKey: IAPIKey) => {
    setAPIKeys(apiKeys.filter((item) => !isEqual(item, oldAPIKey)));
  };

  const titleToolbar = (
    <Button id="add-apikey-button" onClick={() => setModalOpen(true)}>
      Create API Key
    </Button>
  );
  return (
    <Page title="API Key Management" titleToolbar={titleToolbar}>
      <APIKeyCreateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} afterCreated={afterCreated} />
      <APIKeyTable apiKeys={apiKeys} afterDelete={afterDelete} />
    </Page>
  );
};
