import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useConfigureSsrSpaProperty } from '@app/services/ssr';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Split,
  SplitItem,
  TextInput
} from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';

type FormData = {
  propertyIdentifier: string;
  env: string;
  identifier: string;
  // config: string;
  config: { [key: string]: string }; // additional key value pairs
};

const schema = yup.object().shape({
  propertyIdentifier: yup.string(),
  env: yup.string().required()
  // identifier: yup.string().required(),
  // config: yup.object().required()
});
type Props = {
  onClose: () => void;
  propertyIdentifier: string;
};

export const ConfigureSSRForm = ({ propertyIdentifier, onClose }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const [keyValuePairs, setKeyValuePairs] = useState([{ key: '', value: '' }]);
  const configureSsrSpaProperty = useConfigureSsrSpaProperty(propertyIdentifier);
  const handleAddKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
  };
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const webPropertiesKeys = Object.keys(webProperties.data || {});

  const handleKeyValuePairChange = (index: number, key: string, value: string) => {
    const newKeyValuePairs = [...keyValuePairs];
    newKeyValuePairs[index] = { key, value };
    setKeyValuePairs(newKeyValuePairs);
  };
  type MyObjectType = {
    identifier: string;
    env: string;
    config: Record<string, string>;
    propertyIdentifier: string;
  };

  const onSubmit = async (data: MyObjectType) => {
    const json: Record<string, string> = {};
    keyValuePairs.forEach(({ key, value }) => {
      if (key && value) {
        json[key] = value;
      }
    });
    const newData = {
      ...data,
      config: json,
      propertyIdentifier
    };

    try {
      await configureSsrSpaProperty.mutateAsync(newData);
      onClose();
      toast.success('SPA configured successfully');
    } catch (error) {
      toast.error('Failed to configure the spa');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup label="Name">
        <Controller
          name="propertyIdentifier"
          control={control}
          render={() => <TextInput id="name" type="text" value={propertyIdentifier} isDisabled />}
        />
        {errors.propertyIdentifier && <span>{errors.propertyIdentifier.message}</span>}
      </FormGroup>

      <Controller
        control={control}
        name="env"
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormGroup
            label="Select Environment"
            fieldId="select-env"
            validated={error ? 'error' : 'default'}
            helperTextInvalid={error?.message}
          >
            <FormSelect
              label="Select Environment"
              aria-label="FormSelect Input"
              onChange={(event) => {
                onChange(event);
              }}
              value={value}
            >
              <FormSelectOption key={1} label="Please select an environment" isDisabled />
              {webPropertiesKeys.map((envName) => (
                <FormSelectOption key={envName} value={envName} label={envName} />
              ))}
            </FormSelect>
          </FormGroup>
        )}
      />

      <Split hasGutter>
        <SplitItem isFilled>Config</SplitItem>
        <SplitItem
          isFilled
          style={{
            display: 'grid',
            justifyContent: 'right'
          }}
        >
          <Button variant="secondary" onClick={handleAddKeyValuePair}>
            <AddCircleOIcon />
          </Button>
        </SplitItem>
      </Split>

      {keyValuePairs.map((pair, index) => (
        <div key={pair.key}>
          <Split hasGutter>
            <SplitItem isFilled>
              <FormGroup label="Key">
                <TextInput
                  id={`key-${index}`}
                  type="text"
                  value={pair.key}
                  onChange={(event) => handleKeyValuePairChange(index, event, pair.value)}
                />
              </FormGroup>
            </SplitItem>
            <SplitItem isFilled>
              <FormGroup label="Value">
                <TextInput
                  id={`value-${index}`}
                  type="text"
                  value={pair.value}
                  onChange={(event) => handleKeyValuePairChange(index, pair.key, event)}
                />
              </FormGroup>
            </SplitItem>
          </Split>
        </div>
      ))}

      <Button type="submit">Submit</Button>
    </Form>
  );
};
