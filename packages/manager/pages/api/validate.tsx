import { getSession } from "next-auth/react";
import { AnyProps } from "../../components/models/props";
import { post } from "../../utils/api.utils";
import { getValidateUrl } from "../../utils/endpoint.utils";

const Validate = async (req: AnyProps, res: AnyProps) => {
  const url = getValidateUrl();
  const token = (await getSession({ req }) as any).accessToken;
  const userEmail = (await getSession({ req }) as any).user.email;
  const expiresIn = getExpiresIn(req.body.expiresIn);
  const payload = {
    expiresIn: expiresIn,
    env: getEnv(req),
    label: getLabel(req),
    propertyName: getPropertyName(req),
    createdBy: userEmail
  }
  const response = await post<AnyProps>(url, payload, token);
  return res.send({ data: { token: response.token } });
};

export default Validate;
function getExpiresIn(reqExpiresIn: any) {
  const currentDate = new Date();
  const expiresIn = new Date(reqExpiresIn);
  const timeDiff = expiresIn.getTime() - currentDate.getTime();
  const dateDiff: number = timeDiff / (1000 * 3600 * 24);
  return Math.ceil(dateDiff) + "d";
}

function getPropertyName(req: any) {
  return req.body.propertyName;
}

function getEnv(req: any) {
  return req.body.env;
}

function getLabel(req: any) {
  return req.body.label;
}


