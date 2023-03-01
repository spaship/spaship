// import { usecreateSsrSpaProperty } from '@app/services/apiKeys';
import { useAddSsrSpaProperty } from '@app/services/ssr';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, FormGroup, TextArea, TextInput } from '@patternfly/react-core';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';

interface FormData {
  name: string;
  path: string;
  ref?: string;
  imageUrl: string;
  healthCheckPath: string;
  config: object;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  path: yup.string().required(),
  imageUrl: yup.string().required(),
  healthCheckPath: yup.string().required(),
  config: yup.object().required()
});

type Props = {
  onClose: () => void;
  propertyIdentifier: string;
};
export const SSRForm = ({ onClose, propertyIdentifier }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const createSsrSpaProperty = useAddSsrSpaProperty(propertyIdentifier);

  const onSubmit = async (data: FormData) => {
    // useAddSsrSpaProperty(data)
    try {
      await createSsrSpaProperty.mutateAsync({ ...data });
      onClose();
      toast.success('Redeployed SSR successfully');
    } catch (error) {
      toast.error('Failed to redeploy SSR');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup label="Name" isRequired>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            // <TextInput id="name" type="text" isRequired {...field} />
            <TextInput
              id="name"
              type="text"
              isRequired
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.name && <span>{errors.name.message}</span>}
      </FormGroup>
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
      <FormGroup label="Ref">
        <Controller
          name="ref"
          control={control}
          render={
            ({ field }) => (
              <TextInput
                id="ref"
                type="text"
                isRequired
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )
            // <TextInput id="ref" type="text" {...field} />
          }
        />
        {errors.ref && <span>{errors.ref.message}</span>}
      </FormGroup>
      <FormGroup label="Image URL" isRequired>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            // <TextInput id="imageUrl" type="text" isRequired {...field} />
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
      <FormGroup label="Health Check Path" isRequired>
        <Controller
          name="healthCheckPath"
          control={control}
          render={({ field }) => (
            // <TextInput id="healthCheckPath" type="text" isRequired {...field} />
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
      <FormGroup label="Config" isRequired>
        <Controller
          name="config"
          control={control}
          render={
            ({ field }) => (
              <TextArea
                id="config"
                isRequired
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )
            // <TextArea id="config" isRequired {...field} />
          }
        />
        {errors.config && <span>{errors.config.message}</span>}
      </FormGroup>
      <Button type="submit">Submit</Button>
    </Form>
  );
};