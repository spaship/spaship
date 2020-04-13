import React, { useCallback, useState, useEffect } from "react";
import uniqBy from "lodash/uniqBy";
import { Label, Bullseye } from "@patternfly/react-core";
import { Table, TableBody, TableHeader, IRow, IRowCell, compoundExpand } from "@patternfly/react-table";
import { IAPIKey } from "../../models/APIKey";
import APIKeySubTable from "./APIKeySubTable";
import EmptySpinner from "../general/EmptySpinner";
import EmptyNotFound from "../general/EmptyNotFound";

interface IProps {
  isLoading: boolean;
  apiKeys: IAPIKey[];
  afterDelete: (apiKey: IAPIKey) => void;
}

export default (props: IProps) => {
  const { isLoading } = props;
  const [rows, setRows] = useState<IRow[]>([]);
  const columns = [
    "Label",
    {
      title: "Scope",
      cellTransforms: [compoundExpand],
    },
  ];

  const apiKeyToRows = useCallback(
    (apiKeys: IAPIKey[]) => {
      const allRows: IRow[] = [];

      const uniqAPIKeys = uniqBy(apiKeys, "label");

      uniqAPIKeys.forEach((apiKey, apiKeyIndex) => {
        const sameLabelAPIKeys = apiKeys.filter((item) => item.label === apiKey.label);
        const environments = sameLabelAPIKeys.map((item) => item.environment);

        const mainRow: IRow = {
          isOpen: false,
          cells: [
            { title: apiKey.label, props: { component: "th" } },
            {
              title: environments.map(
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
          parent: apiKeyIndex * columns.length,
          compoundParent: 1,
          cells: [
            {
              title: environments ? <APIKeySubTable apiKeys={sameLabelAPIKeys} afterDelete={props.afterDelete} /> : "",
              props: { colSpan: 2, className: "pf-m-no-padding" },
            },
          ],
        };

        allRows.push.apply(allRows, [mainRow, subRow]);
      });
      return allRows;
    },
    [columns.length, props.afterDelete]
  );

  useEffect(() => {
    if (isLoading) {
      setRows([
        {
          heightAuto: true,
          cells: [
            {
              props: { colSpan: 2 },
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
      if (props.apiKeys.length === 0) {
        setRows([
          {
            heightAuto: true,
            cells: [
              {
                props: { colSpan: 2 },
                title: (
                  <Bullseye>
                    <EmptyNotFound
                      title="No API Key Found"
                      body="You could create API Key to any of your environment for CI/CD purpose"
                    />
                  </Bullseye>
                ),
              },
            ],
          },
        ]);
      } else {
        setRows(apiKeyToRows(props.apiKeys));
      }
    }
  }, [props.apiKeys, isLoading, apiKeyToRows]);

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
