import { IRow, Table, TableHeader, TableBody } from "@patternfly/react-table";
import useConfig from "../../hooks/useConfig";

export default () => {
  const { selected } = useConfig();
  const environments = selected?.environments || [];
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
