import React, { useState, useEffect } from "react";
import { Table, TableBody, TableHeader, TableVariant, IRow } from "@patternfly/react-table";
import { Button } from "@patternfly/react-core";

const apiKeys = [
  {
    name: "test-1",
    createdAt: new Date(),
    expiredAt: null
  },
  {
    name: "test-2",
    createdAt: new Date(),
    expiredAt: null
  },
  {
    name: "test-3",
    createdAt: new Date(),
    expiredAt: null
  }
];

export default () => {
  const [rows, setRows] = useState<IRow[]>([]);
  const columns: string[] = ["Name", "Created", "Expires", ""];

  useEffect(() => {
    setRows(
      apiKeys.map<IRow>(apiKey => ({
        cells: [
          apiKey.name,
          apiKey.createdAt.toDateString(),
          apiKey.expiredAt || "Never",
          {
            title: <Button variant="danger">Revoke</Button>
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
