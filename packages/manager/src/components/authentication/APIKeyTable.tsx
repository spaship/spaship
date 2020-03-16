import React, { useState, useEffect } from "react";
import { Table, TableBody, TableHeader, TableVariant, IRow } from "@patternfly/react-table";
import ConfirmButton from "../general/ConfirmButton";
import { ButtonVariant } from "@patternfly/react-core";

const apiKeys = [
  {
    name: "test-1",
    createdAt: new Date(),
    expiredAt: null,
    scopes: ["Dev"]
  },
  {
    name: "test-2",
    createdAt: new Date(),
    expiredAt: null,
    scopes: ["Dev", "QA", "Stage"]
  },
  {
    name: "test-3",
    createdAt: new Date(),
    expiredAt: null,
    scopes: ["Dev", "QA", "Stage", "Prod"]
  }
];

export default () => {
  const [rows, setRows] = useState<IRow[]>([]);
  const columns: string[] = ["Name", "Created", "Expires", "Scope", ""];

  useEffect(() => {
    setRows(
      apiKeys.map<IRow>(apiKey => ({
        cells: [
          apiKey.name,
          apiKey.createdAt.toDateString(),
          apiKey.expiredAt || "Never",
          apiKey.scopes.join(", "),
          {
            title: (
              <ConfirmButton
                label="Revoke"
                title={`Revoke API key "${apiKey.name}"`}
                variant={ButtonVariant.danger}
                onConfirm={() => {}}
              >
                Are you sure revoke this api key ?
              </ConfirmButton>
            )
          }
        ]
      }))
    );
  }, []);

  return (
    <Table variant={TableVariant.compact} cells={columns} rows={rows} aria-label="API keys List">
      <TableHeader />
      <TableBody />
    </Table>
  );
};
