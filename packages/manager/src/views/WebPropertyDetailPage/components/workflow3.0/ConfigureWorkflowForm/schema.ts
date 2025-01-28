import * as yup from 'yup';

export const schema = yup.object({
  name: yup.string().required().label('Application Name'),
  path: yup
    .string()
    .matches(/^[a-zA-Z0-9/-]+$/, 'Only letters, numbers, forward slash and dashes are allowed')
    .required(),
  contextDir: yup
    .string()
    .required()
    .notOneOf([' '], 'Invalid value. Cannot be only spaces.')
    .label('Context Directory'),
  gitRef: yup.string().required().trim().label('Branch'),
  dockerFileName: yup
    .string()
    .required()
    .matches(
      /^[a-zA-Z0-9._-]+$/,
      'Invalid dockerfile name. Dockerfile name must consist of alphanumeric characters, dots, underscores, or hyphens.'
    )
    .label('Dockerfile Name'),
  ref: yup.string(),
  repoUrl: yup.string().required().label('Repository URL'),
  env: yup.string().required().label('Environment'),
  healthCheckPath: yup
    .string()
    .matches(/^[a-zA-Z0-9/-]+$/, 'Only letters, numbers, forward slash and dashes are allowed')
    .required(),
  config: yup.array().of(
    yup.object({
      key: yup.string().required().label('Configuration Key'),
      value: yup.string().required().label('Configuration Value')
    })
  ),
  secret: yup.array().of(
    yup.object({
      key: yup.string().required().label('Configuration Key'),
      value: yup.string().label('Configuration Value'),
      isSecret: yup.boolean().label('isSecret')
    })
  ),
  buildArgs: yup.array().of(
    yup.object({
      key: yup.string().required().label('Key'),
      value: yup.string().required().label('Value')
    })
  ),

  port: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Port must be a number')
    .integer('Port must be an integer')
    .positive('Port must be a positive number')
    .test('port', 'Port must contain only numbers', (value) =>
      /^\d+$/.test(value?.toString() || '')
    )
    .min(1, 'Port is required')
    .max(99999, 'Port must be less than or equal to 5 digits')
    .test('port', 'Port must be less than or equal to 65536', (value) => {
      const portNumber = parseInt(value?.toString() || '', 10);
      return portNumber <= 65536;
    })
    .label('Port'),
  replicas: yup.string().label('Replicas'),
  requiredCpu: yup.string().required('CPU Required is required').label('CPU Required'),
  limitCpu: yup
    .string()
    .required('CPU Limit is required')
    .label('CPU Limit')
    .test(
      'is-less-than-or-equal-to',
      'Required CPU value must be less than or equal to CPU Limit value',
      function isLimitCpuValid(value) {
        const { requiredCpu } = this.parent; // Access sibling fields
        if (!requiredCpu || !value) return true; // Skip validation if either field is not set

        const requiredCpuValue = parseInt(requiredCpu, 10); // Add radix parameter
        const limitCpuValue = parseInt(value, 10); // Add radix parameter

        return requiredCpuValue <= limitCpuValue; // Compare the two values
      }
    ),
  requiredMemory: yup.string().required('Memory Required is required').label('Memory Required'),
  limitMemory: yup
    .string()
    .required('Memory Limit is required')
    .label('Memory Limit')
    .test(
      'is-less-than-or-equal-to',
      'Required Memory value must be less than or equal to Memory Limit value',
      function isLimitMemoryValid(value) {
        const { requiredMemory } = this.parent; // Access sibling fields
        if (!requiredMemory || !value) return true; // Skip validation if either field is not set

        const requiredMemoryValue = parseInt(requiredMemory, 10); // Add radix parameter
        const limitMemoryValue = parseInt(value, 10); // Add radix parameter

        return requiredMemoryValue <= limitMemoryValue; // Compare the two values
      }
    )
});
