// options.ts

import { TOption } from './ConfigureWorkflowForm/types';

export const replicasOption: TOption[] = [
  { value: 'please choose', label: 'Select one', disabled: true },
  { value: '1', label: '1', disabled: false },
  { value: '2', label: '2', disabled: false },
  { value: '3', label: '3', disabled: false },
  { value: '4', label: '4', disabled: false },
  { value: '5', label: '5', disabled: false },
  { value: '6', label: '6', disabled: false }
];

export const requiredCpuOption: TOption[] = [
  { value: '200m', label: '200m', disabled: false },
  { value: '300m', label: '300m', disabled: false },
  { value: '400m', label: '400m', disabled: false },
  { value: '500m', label: '500m', disabled: false },
  { value: '600m', label: '600m', disabled: false },
  { value: '700m', label: '700m', disabled: false },
  { value: '800m', label: '800m', disabled: false },
  { value: '900m', label: '900m', disabled: false },
  { value: '1000m', label: '1000m', disabled: false }
];

export const limitCpuOption: TOption[] = [
  { value: '300m', label: '300m', disabled: false },
  { value: '400m', label: '400m', disabled: false },
  { value: '500m', label: '500m', disabled: false },
  { value: '600m', label: '600m', disabled: false },
  { value: '700m', label: '700m', disabled: false },
  { value: '800m', label: '800m', disabled: false },
  { value: '900m', label: '900m', disabled: false },
  { value: '1000m', label: '1000m', disabled: false }
];

export const requiredMemoryOption: TOption[] = [
  { value: '256Mi', label: '256Mi', disabled: false },
  { value: '512Mi', label: '512Mi', disabled: false },
  { value: '768Mi', label: '768Mi', disabled: false },
  { value: '1024Mi', label: '1024Mi', disabled: false },
  { value: '1280Mi', label: '1280Mi', disabled: false },
  { value: '1536Mi', label: '1536Mi', disabled: false }
];

export const limitMemoryOption: TOption[] = [
  { value: '256Mi', label: '256Mi', disabled: false },
  { value: '512Mi', label: '512Mi', disabled: false },
  { value: '768Mi', label: '768Mi', disabled: false },
  { value: '1024Mi', label: '1024Mi', disabled: false },
  { value: '1280Mi', label: '1280Mi', disabled: false },
  { value: '1536Mi', label: '1536Mi', disabled: false }
];
