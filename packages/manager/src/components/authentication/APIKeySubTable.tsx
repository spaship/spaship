import { Label, ButtonVariant } from "@patternfly/react-core";
import { Table, TableHeader, TableBody, IRow } from "@patternfly/react-table";
import { IAPIKeyEnvironment } from "../../models/APIKey";
import ConfirmButton from "../general/ConfirmButton";
import { deleteAPIKey } from "../../services/APIKeyService";
import { IEnvironment } from "../../config";

interface IProps {
  label: string;
  environments: IEnvironment[];
  apiKeyEnvironments: IAPIKeyEnvironment[];
  afterDelete?: (environment: string, label: string) => void;
}

export default (props: IProps) => {
  const { label, apiKeyEnvironments, environments } = props;
  const columns = ["Environment", "Short Key", "Created At", "Actions"];

  const onClickConfirm = async (label: string, apiKeyEnvironment: IAPIKeyEnvironment) => {
    const environment = environments.find((env) => env.name === apiKeyEnvironment.name);
    if (environment) {
      await deleteAPIKey(environment, label);
      props.afterDelete && props.afterDelete(environment.name, label);
    }
  };

  const rows: IRow[] = apiKeyEnvironments.map((apiKeyEnv, index) => ({
    cells: [
      { title: <Label>{apiKeyEnv.name}</Label> },
      apiKeyEnv.shortKey,
      apiKeyEnv.createdAt,
      {
        title: (
          <ConfirmButton
            key={`${apiKeyEnv.name}=${index}`}
            label="Delete"
            title={`Delete API key "${label}" on ${apiKeyEnv.name}`}
            variant={ButtonVariant.danger}
            onConfirm={() => onClickConfirm(label, apiKeyEnv)}
          >
            Are you sure you want to delete this API Key?
          </ConfirmButton>
        ),
      },
    ],
  }));

  return (
    <Table cells={columns} rows={rows} aria-label="APIKey List">
      <TableHeader />
      <TableBody />
    </Table>
  );
};
