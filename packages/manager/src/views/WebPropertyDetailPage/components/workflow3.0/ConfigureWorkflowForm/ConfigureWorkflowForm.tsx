/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import { Wizard, Button } from '@patternfly/react-core';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { fieldsConfig } from './FieldsConfig';
import { FormField } from './FormSteps';
import { TDataContainerized, TDataWorkflow } from '../types';

interface Props {
  onClose: () => void;
  propertyIdentifier: string;
  dataProps: TDataWorkflow | TDataContainerized;
  flag: string;
}
export const ConfigureWorkflowForm = ({
  onClose,
  propertyIdentifier,
  dataProps,
  flag
}: Props): JSX.Element => {
  const methods = useForm();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  const renderStepContent = (step: number) => {
    const stepConfig = fieldsConfig.find((config) => config.step === step);
    if (!stepConfig) return null;

    return (
      <>
        {stepConfig.fields.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            tooltip={field.tooltip}
            isRequired={field.isRequired}
            type={field.type}
            defaultValue={field.defaultValue}
            options={field.options}
          />
        ))}
      </>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <Wizard
          steps={fieldsConfig.map((config) => ({
            name: config.step,
            component: renderStepContent(config.step),
            canJumpTo: currentStep >= config.step
          }))}
          startAtStep={currentStep}
          onNext={handleNext}
          onBack={handleBack}
          onSave={() => methods.handleSubmit(handleSubmit)()}
        />
        <div style={{ marginTop: '16px' }}>
          {currentStep > 1 && (
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          )}
          {currentStep < fieldsConfig.length && (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          )}
          {currentStep === fieldsConfig.length && (
            <Button variant="primary" type="submit">
              Submit
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
