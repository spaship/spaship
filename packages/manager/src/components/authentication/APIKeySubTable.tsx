import React, { useState, useEffect, useCallback } from "react";
import { Label, ButtonVariant } from "@patternfly/react-core";
import { Table, TableHeader, TableBody, IRow } from "@patternfly/react-table";
import { IAPIKey } from "../../models/APIKey";
import ConfirmButton from "../general/ConfirmButton";
import * as APIService from "../../services/APIService";
import { IEnvironment } from "../../config";

interface IProps {
  apiKeys: IAPIKey[];
  afterDelete?: (apiKey: IAPIKey) => void;
}

export default (props: IProps) => {
  const { apiKeys } = props;
  const [rows, setRows] = useState<IRow[]>([]);
  const columns = ["Environment", "Short Key", "Expired Date", "Created At", "Actions"];

  const apiKeysToRows = useCallback((apiKeyList: IAPIKey[], props) => {
    const onClickConfirm = async (apiKey: IAPIKey, environment: IEnvironment) => {
      await APIService.deleteAPIKey(apiKey, environment);
      props.afterDelete && props.afterDelete(apiKey);
    };

    return apiKeyList.map((apiKey) => ({
      cells: [
        { title: <Label>{apiKey.environment?.name}</Label> },
        apiKey.shortKey,
        apiKey.expiredDate || "Never",
        apiKey.createdAt,
        {
          title: (
            <ConfirmButton
              label="Revoke"
              title={`Revoke API key "${apiKey.label}" on ${apiKey.environment?.name}`}
              variant={ButtonVariant.danger}
              onConfirm={() => apiKey.environment && onClickConfirm(apiKey, apiKey.environment)}
            >
              Are you sure revoke this api key ?
            </ConfirmButton>
          ),
        },
      ],
    }));
  }, []);
  useEffect(() => {
    if (apiKeys) {
      setRows(apiKeysToRows(apiKeys, props));
    }
  }, [apiKeys, apiKeysToRows, props]);
  return (
    <Table cells={columns} rows={rows} aria-label="APIKey List">
      <TableHeader />
      <TableBody />
    </Table>
  );
};
