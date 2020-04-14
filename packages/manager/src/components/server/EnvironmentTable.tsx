import React from "react";
import config from "../../config";
import { IRow, Table, TableHeader, TableBody } from "@patternfly/react-table";

export default () => {
  const environments = config.environments;
  const columns = ["Name", "API", "Publish Domain"];

  const rows: IRow[] = environments.map((env) => ({
    cells: [env.name, env.api, env.domain],
  }));

  return (
    <Table cells={columns} rows={rows} aria-label="Environments List">
      <TableHeader />
      <TableBody />
    </Table>
  );
};
