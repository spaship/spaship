/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
import { TEnv } from '@app/services/persistent/types';
import { useUpdateSync } from '@app/services/sync';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextArea
} from '@patternfly/react-core';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

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
    setValue,
    formState: { isSubmitting }
  } = useForm<FormData>({
    mode: 'onSubmit',
    resolver: yupResolver(schema)
  });
  const updateSync = useUpdateSync(propertyIdentifier);
  const { data: session } = useSession();
  const updateSyncModal = (event: string) => {
    const syncConfig = env.find((envObject) => envObject.env === event)?.sync;
    setValue('sync', syncConfig || '');
  };
  const onSubmit = async (formData: FormData) => {
    try {
      await updateSync.mutateAsync({
        ...formData,
        propertyIdentifier,
        createdBy: session?.user?.email || ''
      });
      toast.success('Successfully updated Sync');
      onClose();
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        onClose();
      } else {
        toast.error('Failed to update Sync');
      }
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
              onChange={(event) => {
                updateSyncModal(event);
                onChange(event);
              }}
              value={value}
            >
              <FormSelectOption key={1} label="Please select an environment" isDisabled />
              {env.map((option) => (
                <FormSelectOption key={option._id} value={option.env} label={option.env} />
              ))}
            </FormSelect>
          </FormGroup>
        )}
      />
      <Controller
        control={control}
        name="sync"
        render={({ field, fieldState: { error } }) => (
          <FormGroup
            label="Sync Config"
            name="sync-config"
            fieldId="sync-config"
            validated={error ? 'error' : 'default'}
            helperTextInvalid={error?.message}
          >
            <TextArea
              style={{ minHeight: '16rem' }}
              placeholder="Please enter sync config"
              aria-label="textarea to add sync config"
              id="sync-config"
              resizeOrientation="vertical"
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
