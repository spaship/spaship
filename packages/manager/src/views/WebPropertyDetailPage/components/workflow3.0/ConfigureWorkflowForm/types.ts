import { TDataContainerized, TDataWorkflow } from '../types';

export interface Props {
  onClose: () => void;
  propertyIdentifier: string;
  dataProps: TDataWorkflow | TDataContainerized;
  flag: string;
}
export type MapItem = {
  name: string;
  value: string;
};
export interface ValidateDTO {
  propertyIdentifier: string;
  identifier: string;
  repoUrl: string;
  gitRef: string;
  contextDir: string;
  dockerFileName?: string;
}

export interface ValidationResponse {
  port?: number;
  warning?: string;
}

export interface TFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  tooltip?: string;
  isRequired: boolean;
  type?: 'text' | 'select' | 'secret' | string | TOption[] | undefined;
  defaultValue?: string | number;
  disabled?: boolean;
  options?: TOption[];
}

export interface TOption {
  value: string;
  label: string;
  disabled: boolean;
}
export interface TStepConfig {
  step: number;
  fields: TFieldConfig[];
}

export interface TFormStepProps {
  step: number;
  onNext: () => void;
  onBack?: () => void;
  validateMessage?: string;
}
