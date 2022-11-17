/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
import { TEnv } from '@app/services/persistent/types';
import * as yup from 'yup';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextArea
} from '@patternfly/react-core';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateSync } from '@app/services/sync';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

type Props = {
  env: TEnv[];
  onClose: () => void;
  propertyIdentifier: string;
};

export const schema = yup.object({
  env: yup.string().label('Select Environment').required(),
  sync: yup.string().label('Enter Sync Config').required()
});

export interface FormData extends yup.InferType<typeof schema> {}

export const SyncServiceForm = ({ env, onClose, propertyIdentifier }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>({
    mode: 'onSubmit',
    resolver: yupResolver(schema)
  });
  const options = env.map((environment: TEnv) => ({
    ...environment,
    value: environment.env,
    label: environment.env
  }));
  const updateSync = useUpdateSync(propertyIdentifier);
  const { data: session } = useSession();

  const onSubmit = async (formData: FormData) => {
    try {
      await updateSync.mutateAsync({
        ...formData,
        propertyIdentifier,
        createdBy: session?.user.email || ''
      });
      toast.success('Successfully updated Sync');
      onClose();
    } catch (error) {
      toast.error('Failed to update Sync');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
              onChange={onChange}
              value={value}
            >
              <FormSelectOption key={1} label="Please select an environment" isDisabled />
              {options.map((option) => (
                <FormSelectOption key={option._id} value={option.value} label={option.label} />
              ))}
            </FormSelect>
          </FormGroup>
        )}
      />
      <Controller
        control={control}
        name="sync"
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
          <FormGroup
            label="Enter Sync Config"
            name="sync-config"
            fieldId="sync-config"
            validated={error ? 'error' : 'default'}
            helperTextInvalid={error?.message}
          >
            <TextArea
              placeholder="Please enter sync config"
              id="sync-config"
              aria-label="textarea to add sync config"
              {...field}
            />
          </FormGroup>
        )}
      />
      <ActionGroup>
        <Button variant="primary" type="submit" isLoading={isSubmitting} isDisabled={isSubmitting}>
          Sync
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};
