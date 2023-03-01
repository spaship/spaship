import { useConfigureSsrSpaProperty } from '@app/services/ssr';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, FormGroup, Split, SplitItem, TextArea, TextInput } from '@patternfly/react-core';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';

interface FormData {
  propertyIdentifier: string;
  env: string;
  identifier: string;
  config: object;
}

const schema = yup.object().shape({
  propertyIdentifier: yup.string(),
  env: yup.string().required(),
  identifier: yup.string().required(),
  config: yup.object().required()
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

  const configureSsrSpaProperty = useConfigureSsrSpaProperty(propertyIdentifier);

  const onSubmit = async (data: FormData) => {
    data.propertyIdentifier = propertyIdentifier;
    console.log('configure submit', data);
    try {
      await configureSsrSpaProperty.mutateAsync({
        ...data
      });
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
          render={({ field }) => (
            <TextInput id="name" type="text" value={propertyIdentifier} isDisabled />
          )}
        />
        {errors.propertyIdentifier && <span>{errors.propertyIdentifier.message}</span>}
      </FormGroup>
      <Split hasGutter>
        <SplitItem isFilled>   <FormGroup label="Environment" isRequired>
          <Controller
            name="env"
            control={control}
            render={
              ({ field }) => (
                <TextInput
                  id="env"
                  type="text"
                  isRequired
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )
              // <TextInput id="env" type="text" isRequired {...field} />
            }
          />
          {errors.env && <span>{errors.env.message}</span>}
        </FormGroup>
        </SplitItem>
        <SplitItem isFilled>
          <FormGroup label="Identifier" isRequired>
            <Controller
              name="identifier"
              control={control}
              render={
                ({ field }) => (
                  <TextInput
                    id="identifier"
                    type="text"
                    isRequired
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )
                // <TextInput id="identifier" type="text" isRequired {...field} />
              }
            />
            {errors.identifier && <span>{errors.identifier.message}</span>}
          </FormGroup>
        </SplitItem>
      </Split>




      <FormGroup label="Config" isRequired>
        <Controller
          name="config"
          control={control}
          render={({ field }) => (
            <TextArea
              id="config"
              isRequired
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        //   <TextArea id="config" isRequired {...field} />}
        />
        {errors.config && <span>{errors.config.message}</span>}
      </FormGroup>
      <Button type="submit">Submit</Button>
    </Form>
  );
};