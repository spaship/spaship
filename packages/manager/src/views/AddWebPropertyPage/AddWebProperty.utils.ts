import * as yup from 'yup';

export const addNewWebPropertySchema = yup.object({
  propertyTitle: yup.string().label('Property Title').alphaNumbericOnly().max(50).trim().required(),
  // TODO: change this to URL validation, after server supports http protocol append
  url: yup.string().label('Hostname URL').trim().max(250).required(),
  env: yup
    .string()
    .label('Environement Name')
    .noWhitespace()
    .trim()
    .alphabetsOnly()
    .max(50)
    .required(),
  deploymentConnectionType: yup.bool().required()
});

export interface FormData extends yup.InferType<typeof addNewWebPropertySchema> {}
