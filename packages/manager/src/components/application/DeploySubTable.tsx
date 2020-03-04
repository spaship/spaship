import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, IRow } from "@patternfly/react-table";
import { IDeployHistory } from "../../models/Application";

interface IProps {
  deployHistory: IDeployHistory[];
}
export default (props: IProps) => {
  const { deployHistory } = props;
  const [rows, setRows] = useState<IRow[]>([]);
  const columns = ["Version", "Deploy Time"];

  useEffect(() => {
    if (deployHistory) {
      setRows(
        deployHistory.map(history => ({
          cells: [history.version, history.timestamp.toDateString()]
        }))
      );
    }
  }, [deployHistory]);
  return (
    <Table cells={columns} rows={rows} aria-label="Application List">
      <TableHeader />
      <TableBody />
    </Table>
  );
};
