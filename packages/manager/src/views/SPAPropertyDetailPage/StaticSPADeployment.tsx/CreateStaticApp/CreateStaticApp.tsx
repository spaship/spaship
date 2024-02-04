/* eslint-disable react/jsx-props-no-spreading */
import { useCreateStaticApp, useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
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
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

interface Props {
  onClose: () => void;
  propertyIdentifier: string;
}
const schema = yup.object({
  name: yup.string().required().label('Application Name'),
  path: yup
    .string()
    .matches(/^[a-zA-Z0-9/-]+$/, 'Only letters, numbers, forward slash and dashes are allowed')
    .required(),
  env: yup.string().required().label('Environment'),
  ref: yup.string(),
  upload: yup.mixed().test('fileType', 'Only ZIP files allowed', (value) => {
    if (!value) return true;
    return value && value[0]?.type === 'application/zip';
  })
});

export type FormData = yup.InferType<typeof schema>;

export const CreateStaticApp = ({ onClose, propertyIdentifier }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm<any>({
    defaultValues: { path: '/', upload: null },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const webPropertiesKeys = Object.keys(webProperties.data || {});
  const createStaticSpa = useCreateStaticApp();

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('propertyIdentifier', propertyIdentifier);
      formData.append('name', data.name);
      formData.append('path', data.path);
      formData.append('env', data.env);
      formData.append('ref', data.ref);

      if (data.upload && data.upload[0]) {
        formData.append('upload', data.upload[0], data.upload[0].name);
      }
      await createStaticSpa.mutateAsync(formData);

      onClose();
      toast.success('Deployed application successfully');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        onClose();
      } else if (error instanceof AxiosError && error.response && error.response.status === 400) {
        toast.error(
          "Given Image URL doesn't exists on the source registry, please provide a valid imageUrl."
        );
      } else {
        toast.error('Failed to deploy  application');
      }
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setValue('upload', files);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Application Name"
                isRequired
                fieldId="property-name"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Application Name"
                  type="text"
                  id="property-name"
                  {...field}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="env"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormGroup
                label="Select Environment"
                fieldId="select-env"
                validated={error ? 'error' : 'default'}
                isRequired
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
        </SplitItem>
      </Split>

      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="ref"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Reference"
                fieldId="ref"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput placeholder="Reference" type="text" id="ref" {...field} />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="path"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="path"
                fieldId="ref"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput placeholder="path" type="text" id="path" {...field} />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>
      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="upload"
            render={({ field }) => (
              <FormGroup
                label="Upload ZIP file"
                fieldId="file-upload"
                helperText="Only ZIP files allowed"
              >
                <input
                  type="file"
                  accept=".zip"
                  onChange={(e) => {
                    field.onChange(e);
                    onFileChange(e);
                  }}
                  id="file-upload"
                />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>
      <Button isLoading={isSubmitting} isDisabled={isSubmitting} type="submit">
        Submit
      </Button>
    </Form>
  );
};
