import { TStepConfig } from './types';
import {
  limitCpuOption,
  limitMemoryOption,
  replicasOption,
  requiredCpuOption,
  requiredMemoryOption
} from '../options';

export const fieldsConfig: TStepConfig[] = [
  {
    step: 1,
    fields: [
      {
        name: 'repoUrl',
        label: 'Repository URL',
        placeholder: 'Enter Repository URL',
        tooltip:
          'Public gitlab/github repository URL of the application. Example: https://github.com/spaship/spaship',
        type: 'text',
        isRequired: true,
        disabled: false,
        defaultValue: ''
      },
      {
        name: 'contextDir',
        label: 'Context Directory',
        placeholder: 'Enter Context Directory',
        tooltip:
          'For mono repo, specify the directory name where the application exists. Default is /.',
        type: 'text',
        isRequired: true,
        disabled: false,
        defaultValue: '/'
      },
      {
        name: 'gitRef',
        label: 'Git Branch',
        placeholder: 'Enter Git Branch',
        tooltip: 'The Git branch to use for deployment.',
        type: 'text',
        isRequired: true,
        disabled: false,
        defaultValue: ''
      },
      {
        name: 'dockerFileName',
        label: 'Dockerfile Name',
        placeholder: 'Enter Dockerfile Name',
        tooltip: 'The name of the Dockerfile to use for building the image.',
        type: 'text',
        isRequired: true,
        disabled: false,
        defaultValue: 'Dockerfile'
      }
    ]
  },
  {
    step: 2,
    fields: [
      {
        name: 'name',
        label: 'Application Name',
        placeholder: 'Enter Application Name',
        tooltip: 'The name of the application.',
        type: 'text',
        isRequired: true,
        disabled: true,
        defaultValue: ''
      },
      {
        name: 'path',
        label: 'Path',
        placeholder: 'Enter Path',
        tooltip: 'This should match the homepage attribute of the package.json file.',
        type: 'text',
        isRequired: true,
        disabled: false,
        defaultValue: '/'
      },
      {
        name: 'healthCheckPath',
        label: 'Health Check Path',
        placeholder: 'Enter Health Check Path',
        tooltip:
          'Used for application liveness checking for monitoring and auto redeployment on failure.',
        type: 'text',
        isRequired: true,
        disabled: false,
        defaultValue: '/health'
      },
      {
        name: 'port',
        label: 'Port',
        placeholder: 'Enter Port',
        tooltip: 'Specify the port number mentioned in your Dockerfile’s EXPOSE instruction.',
        type: 'text',
        isRequired: true,
        disabled: false,
        defaultValue: '3000'
      }
    ]
  },
  {
    step: 3,
    fields: [
      {
        name: 'config',
        label: 'Configuration',
        placeholder: 'Add key-value pairs for runtime configuration',
        tooltip: 'Configuration map to store runtime environment variables (key-value pairs).',
        type: 'text',
        isRequired: false,
        disabled: false,
        defaultValue: ''
      },
      {
        name: 'secret',
        label: 'Secret',
        placeholder: 'Add key-value pairs for secrets',
        tooltip: 'Secret map for secure variables to be accessed internally by the application.',
        type: 'secret',
        isRequired: false,
        disabled: false,
        defaultValue: ''
      }
    ]
  },
  {
    step: 4,
    fields: [
      {
        name: 'buildArgs',
        label: 'Build Arguments',
        placeholder: 'Add key-value pairs for build arguments',
        tooltip: 'Key-value pairs required for building the application.',
        type: 'text',
        isRequired: false,
        disabled: false,
        defaultValue: ''
      }
    ]
  },
  {
    step: 5,
    fields: [
      {
        name: 'requiredCpu',
        label: 'CPU Required',
        placeholder: 'Select Required CPU',
        tooltip: 'Specify the minimum CPU required for the application.',
        type: 'select',
        isRequired: true,
        disabled: false,
        options: requiredCpuOption,
        defaultValue: requiredCpuOption[0]?.value || ''
      },
      {
        name: 'limitCpu',
        label: 'CPU Limit',
        placeholder: 'Select CPU Limit',
        tooltip: 'Specify the maximum CPU limit for the application.',
        type: 'select',
        isRequired: true,
        disabled: false,
        options: limitCpuOption,
        defaultValue: limitCpuOption[0]?.value || ''
      },
      {
        name: 'requiredMemory',
        label: 'Memory Required',
        placeholder: 'Select Required Memory',
        tooltip: 'Specify the minimum memory required for the application.',
        type: 'select',
        isRequired: true,
        disabled: false,
        options: requiredMemoryOption,
        defaultValue: requiredMemoryOption[0]?.value || ''
      },
      {
        name: 'limitMemory',
        label: 'Memory Limit',
        placeholder: 'Select Memory Limit',
        tooltip: 'Specify the maximum memory limit for the application.',
        type: 'select',
        isRequired: true,
        disabled: false,
        options: limitMemoryOption,
        defaultValue: limitMemoryOption[0]?.value || ''
      },
      {
        name: 'replicas',
        label: 'Number of Replicas',
        placeholder: 'Select Number of Replicas',
        tooltip: 'Specify the number of replicas to deploy.',
        type: 'select',
        isRequired: true,
        disabled: false,
        options: replicasOption,
        defaultValue: replicasOption[0]?.value || ''
      }
    ]
  },
  {
    step: 6,
    fields: [
      {
        name: 'repoUrl',
        label: 'Repository URL',
        placeholder: 'Enter Repository URL',
        tooltip: '',
        type: 'text',
        isRequired: false,
        disabled: true,
        defaultValue: ''
      },
      {
        name: 'contextDir',
        label: 'Context Directory',
        placeholder: 'Enter Context Directory',
        tooltip: '',
        type: 'text',
        isRequired: false,
        disabled: true,
        defaultValue: ''
      },
      {
        name: 'gitRef',
        label: 'Git Branch',
        placeholder: 'Enter Git Branch',
        tooltip: '',
        type: 'text',
        isRequired: false,
        disabled: true,
        defaultValue: ''
      },
      {
        name: 'dockerFileName',
        label: 'Dockerfile Name',
        placeholder: 'Enter Dockerfile Name',
        tooltip: '',
        type: 'text',
        isRequired: false,
        disabled: true,
        defaultValue: ''
      },
      {
        name: 'name',
        label: 'Application Name',
        placeholder: 'Enter Application Name',
        tooltip: '',
        type: 'text',
        isRequired: false,
        disabled: true,
        defaultValue: ''
      },
      {
        name: 'path',
        label: 'Path',
        placeholder: 'Enter Path',
        tooltip: '',
        type: 'text',
        isRequired: false,
        disabled: true,
        defaultValue: ''
      },
      {
        name: 'port',
        label: 'Port',
        placeholder: 'Enter Port',
        tooltip: '',
        type: 'text',
        isRequired: false,
        disabled: true,
        defaultValue: ''
      },
      {
        name: 'replicas',
        label: 'Number of Replicas',
        placeholder: 'Enter Number of Replicas',
        tooltip: '',
        type: 'text',
        isRequired: false,
        disabled: true,
        defaultValue: ''
      }
    ]
  }
];
