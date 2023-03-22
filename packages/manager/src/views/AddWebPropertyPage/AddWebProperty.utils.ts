import * as yup from 'yup';

export const addNewWebPropertySchema = yup.object({
  title: yup.string().label('Property Title').alphaNumbericOnly().max(50).trim().required(),
  // TODO: change this to URL validation, after server supports http protocol append
  url: yup.string().label('Hostname URL').trim().max(250).required(),
  env: yup
    .string()
    .required()
    .label('Environment Name')
    .noWhitespace()
    .trim()
    .matches(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and dashes are allowed')
    .max(50),
  cluster: yup.string().label('Environment Type').oneOf(['preprod', 'prod']).required()
});

export interface FormData extends yup.InferType<typeof addNewWebPropertySchema> {}
