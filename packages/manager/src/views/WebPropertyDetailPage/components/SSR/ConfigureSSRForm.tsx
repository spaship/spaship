import { useAddSsrSpaProperty } from '@app/services/ssr';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, FormGroup, Split, SplitItem, TextInput } from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';

interface FormData {
  name: string;
  path: string;
  ref?: string;
  imageUrl: string;
  healthCheckPath: string;
  config: { [key: string]: string };
  env: string;
  propertyIdentifier: string;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  path: yup.string().required(),
  imageUrl: yup.string().required(),
  healthCheckPath: yup.string().required()
});

type Props = {
  onClose: () => void;
  propertyIdentifier: string;
  dataprops: any;
};

export const ConfigureSSRForm = ({
  onClose,
  propertyIdentifier,
  dataprops
}: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const createSsrSpaProperty = useAddSsrSpaProperty(propertyIdentifier);

  const [keyValuePairs, setKeyValuePairs] = useState([{ key: '', value: '' }]);
  const handleAddKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
  };

  const handleKeyValuePairChange = (index: number, key: string, value: string) => {
    const newKeyValuePairs = [...keyValuePairs];
    newKeyValuePairs[index] = { key, value };
    setKeyValuePairs(newKeyValuePairs);
  };

  const onSubmit = async (data: FormData) => {
    const json: Record<string, string> = {};
    keyValuePairs.forEach(({ key, value }) => {
      if (key && value) {
        json[key] = value;
      }
    });
    const temp = data;
    if (!temp.path.startsWith('/')) {
      temp.path = `/${temp.path}`;
    }
    if (!temp.healthCheckPath.startsWith('/')) {
      temp.healthCheckPath = `/${temp.healthCheckPath}`;
    }

    const newData = {
      ...temp,
      config: json,
      propertyIdentifier
    };
    try {
      await createSsrSpaProperty.mutateAsync(newData);
      onClose();
      toast.success('Configured and deployed SSR successfully');
    } catch (error) {
      toast.error('Failed to deploy SSR');
    }
  };

  useEffect(() => {
    const configKeys = Object.keys(dataprops.config);
    const configPairs = configKeys.map((key) => ({ key, value: dataprops.config[key] }));
    setKeyValuePairs(configPairs);
    reset(dataprops);
  }, [reset, dataprops]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Split hasGutter>
        <SplitItem isFilled>
          <FormGroup label="Name" isRequired>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="name"
                  type="text"
                  isDisabled
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.name && <span>{errors.name.message}</span>}
          </FormGroup>
        </SplitItem>
        <SplitItem isFilled>
          <FormGroup label="Select Environment" fieldId="select-env">
            <Controller
              name="env"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="env"
                  type="text"
                  isDisabled
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.name && <span>{errors.name.message}</span>}
          </FormGroup>
        </SplitItem>
      </Split>

      <Split hasGutter>
        <SplitItem isFilled>
          <FormGroup label="Path" isRequired>
            <Controller
              name="path"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="path"
                  type="text"
                  isRequired
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.path && <span>{errors.path.message}</span>}
          </FormGroup>
        </SplitItem>
        <SplitItem isFilled>
          <FormGroup label="Ref">
            <Controller
              name="ref"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="ref"
                  type="text"
                  isRequired
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.ref && <span>{errors.ref.message}</span>}
          </FormGroup>
        </SplitItem>
      </Split>

      <Split hasGutter>
        <SplitItem isFilled>
          <FormGroup label="Image URL" isRequired>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="imageUrl"
                  type="text"
                  isRequired
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.imageUrl && <span>{errors.imageUrl.message}</span>}
          </FormGroup>
        </SplitItem>
        <SplitItem isFilled>
          <FormGroup label="Health Check Path" isRequired>
            <Controller
              name="healthCheckPath"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="healthCheckPath"
                  type="text"
                  isRequired
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.healthCheckPath && <span>{errors.healthCheckPath.message}</span>}
          </FormGroup>
        </SplitItem>
      </Split>

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
        <Split hasGutter key={`key-${index + 1}`}>
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
      ))}

      <Button type="submit">Submit</Button>
    </Form>
  );
};
