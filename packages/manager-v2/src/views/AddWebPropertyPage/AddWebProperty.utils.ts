import { requiredErrMsg } from '@app/utils/formErrMessages';
import * as yup from 'yup';

export const addNewWebPropertySchema = yup.object({
  propertyTitle: yup.string().alphaNumbericOnly().trim().required(requiredErrMsg('Property Title')),
  // TODO: change this to URL validation, after server supports http protocol append
  url: yup.string().trim().required(requiredErrMsg('Hostname URL')),
  env: yup
    .string()
    .noWhitespace()
    .trim()
    .alphabetsOnly()
    .required(requiredErrMsg('Environement Name')),
  deploymentConnectionType: yup.bool().required()
});

export interface FormData extends yup.InferType<typeof addNewWebPropertySchema> {}
