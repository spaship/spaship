import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, IRow } from "@patternfly/react-table";
import { IApplication } from "../../models/Application";
import config from "../../config";

interface IProps {
  application: IApplication;
}
export default (props: IProps) => {
  const { application } = props;
  const columns: string[] = ["Name", "Url", "Version", "Update"];
  const [rows, setRows] = useState<IRow[]>([]);
  useEffect(() => {
    setRows(
      config.environments.map((env) => {
        const applicationEnvironment = application.environments.find((appEnv) => appEnv.name === env.name);
        if (applicationEnvironment) {
          return {
            cells: [
              env.name,
              {
                title: (
                  <a href={`${env.domain}${application.path}`} target="_blank" rel="noopener noreferrer">
                    {`${env.domain}${application.path}`}
                  </a>
                ),
              },
              applicationEnvironment.ref,
              applicationEnvironment.timestamp,
            ],
          };
        }
        return {
          cells: [env.name, "", "", ""],
        };
      })
    );
  }, [application]);

  return (
    <Table cells={columns} rows={rows} aria-label="Application Environment List">
      <TableHeader />
      <TableBody />
    </Table>
  );
};
