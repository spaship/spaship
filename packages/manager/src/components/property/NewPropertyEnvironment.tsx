import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardActions,
  CardTitle,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";
import { IEnvironment } from "../../config";

interface IProps {
  index: number;
  environment: IEnvironment;
  onChange: (id: number, env: IEnvironment) => void;
  onRemove: (id: number) => void;
}
export default (props: IProps) => {
  const { index, environment, onChange, onRemove } = props;

  const handleRemove = () => {
    onRemove(index);
  };

  const handleNameChange = (value: string) => {
    onChange(index, {
      ...environment,
      name: value,
    });
  };

  const handleApiChange = (value: string) => {
    onChange(index, {
      ...environment,
      api: value,
    });
  };

  const handleDomainChange = (value: string) => {
    onChange(index, {
      ...environment,
      domain: value,
    });
  };
  return (
    <>
      <Card isFlat>
        <CardHeader>
          <CardTitle>{environment.name}</CardTitle>
          <CardActions>
            {index !== 0 && (
              <Button variant="plain" aria-label="Action" onClick={handleRemove}>
                <TimesIcon />
              </Button>
            )}
          </CardActions>
        </CardHeader>

        <CardBody>
          <FormGroup
            label="Name"
            isRequired
            fieldId="horizontal-form-name"
            helperText="Please provide the environment name"
          >
            <TextInput
              value={environment.name}
              isRequired
              type="text"
              id="horizontal-form-name"
              aria-describedby="horizontal-form-name-helper"
              name="horizontal-form-name"
              onChange={handleNameChange}
            />
          </FormGroup>

          <FormGroup
            label={`${environment.name} API`}
            isRequired
            fieldId="horizontal-form-api"
            helperText={`Please provide the ${environment.name} api`}
          >
            <TextInput
              value={environment.api}
              isRequired
              type="text"
              id="horizontal-form-name"
              aria-describedby="horizontal-form-name-helper"
              name="horizontal-form-name"
              onChange={handleApiChange}
            />
          </FormGroup>

          <FormGroup
            label={`${environment.name} Domain`}
            isRequired
            fieldId="horizontal-form-domain"
            helperText={`Please provide the ${environment.name} publish domain`}
          >
            <TextInput
              value={environment.domain}
              isRequired
              type="text"
              id="horizontal-form-name"
              aria-describedby="horizontal-form-name-helper"
              name="horizontal-form-name"
              onChange={handleDomainChange}
            />
          </FormGroup>
        </CardBody>
      </Card>
      <br />
    </>
  );
};
