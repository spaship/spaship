import { useCallback, useState, useEffect } from "react";
import { Label, Bullseye } from "@patternfly/react-core";
import { Table, TableBody, TableHeader, IRow, IRowCell, compoundExpand } from "@patternfly/react-table";
import { IAPIKey } from "../../models/APIKey";
import APIKeySubTable from "./APIKeySubTable";
import EmptySpinner from "../general/EmptySpinner";
import EmptyNotFound from "../general/EmptyNotFound";
import useConfig from "../../hooks/useConfig";
import EmptyAccessDenied from "../general/EmptyAccessDenied";

interface IProps {
  isLoading: boolean;
  hasAccess: boolean;
  apiKeys: IAPIKey[];
  afterDelete: (environment: string, label: string) => void;
}

export default (props: IProps) => {
  const { isLoading } = props;
  const { hasAccess } = props || true;
  const { selected } = useConfig();
  const selectedEnvs = selected?.environments || [];
  const environments = selectedEnvs;
  const [rows, setRows] = useState<IRow[]>([]);
  const columns = [
    "Label",
    "Expires At",
    {
      title: "Scope",
      cellTransforms: [compoundExpand],
    },
  ];

  const apiKeyToRows = useCallback(
    (apiKeys: IAPIKey[]) => {
      const allRows: IRow[] = [];

      apiKeys.forEach((apiKey, apiKeyIndex) => {
        const mainRow: IRow = {
          isOpen: false,
          cells: [
            { title: apiKey.label, props: { component: "th" } },
            { title: apiKey.expiredDate ? new Date(apiKey.expiredDate).toDateString() : "" || "Never" },
            {
              title: apiKey.environments.map(
                (env, index) =>
                  env && (
                    <span key={`${apiKey.label}-${env.name}-${index}`}>
                      <Label key={`${apiKey.label}-${env.name}`}>{env.name}</Label>{" "}
                    </span>
                  )
              ),
              props: { isOpen: false },
            },
          ],
        };

        const subRow: IRow = {
          parent: apiKeyIndex * 2,
          compoundParent: 2,
          cells: [
            {
              title: apiKey.environments ? (
                <APIKeySubTable
                  label={apiKey.label}
                  apiKeyEnvironments={apiKey.environments}
                  environments={environments}
                  afterDelete={props.afterDelete}
                />
              ) : (
                ""
              ),
              props: { colSpan: 3, className: "pf-m-no-padding" },
            },
          ],
        };

        allRows.push.apply(allRows, [mainRow, subRow]);
      });

      return allRows;
    },
    [props.afterDelete, environments]
  );

  useEffect(() => {
    if (isLoading) {
      setRows([
        {
          heightAuto: true,
          cells: [
            {
              props: { colSpan: 3 },
              title: (
                <Bullseye>
                  <EmptySpinner />
                </Bullseye>
              ),
            },
          ],
        },
      ]);
    } else {
      if (!hasAccess) {
        setRows([{
          heightAuto: true,
          cells: [{
            props: { colSpan: 3 },
            title: (
              <Bullseye>
                <EmptyAccessDenied
                  title="Access Denied"
                  body="You are not authorized to access this page! If you think this is a mistake or you need to have access to this page, please contact a SPAship admin to add you to the spaship-users LDAP group(s) for this property."
                />
              </Bullseye>
            ),
          }]
        }]);
      } else if (props.apiKeys.length === 0) {
        setRows([{
            heightAuto: true,
            cells: [{
                props: { colSpan: 3 },
                title: (
                  <Bullseye>
                    <EmptyNotFound
                      title="No API Key Found"
                      body="You can create an API Key to any of your environments for CI/CD purposes."
                    />
                  </Bullseye>
                ),
              }],
          }]);
      } else {
        setRows(apiKeyToRows(props.apiKeys));
      }
    }
  }, [props.apiKeys, isLoading, apiKeyToRows, hasAccess]);

  const onExpand = (event: any, rowIndex: number, colIndex: number, isOpen: boolean) => {
    if (!isOpen) {
      (rows[rowIndex].cells as IRowCell[]).forEach((cell) => {
        if (cell.props) cell.props.isOpen = false;
      });
      (rows[rowIndex].cells as IRowCell[])[colIndex].props.isOpen = true;
      rows[rowIndex].isOpen = true;
    } else {
      (rows[rowIndex].cells as IRowCell[])[colIndex].props.isOpen = false;
      rows[rowIndex].isOpen = (rows[rowIndex].cells as IRowCell[]).some((cell) => cell.props && cell.props.isOpen);
    }
    setRows([...rows]);
  };

  return (
    <Table cells={columns} rows={rows} onExpand={onExpand} aria-label="API keys List">
      <TableHeader />
      <TableBody />
    </Table>
  );
};
