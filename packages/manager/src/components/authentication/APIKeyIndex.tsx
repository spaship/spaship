import React, { useState } from "react";
import Page from "../../layout/Page";
import APIKeyTable from "./APIKeyTable";
import APIKeyCreateModal from "./APIKeyCreateModal";
import { Button } from "@patternfly/react-core";
export default () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const titleToolbar = <Button onClick={() => setModalOpen(true)}>Create API Key</Button>;
  return (
    <Page title="API Key Management" titleToolbar={titleToolbar}>
      <APIKeyCreateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <APIKeyTable />
    </Page>
  );
};
