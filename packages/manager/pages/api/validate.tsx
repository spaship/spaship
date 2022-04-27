import { AnyProps } from "../../components/models/props";
import { post } from "../../utils/api.utils";
import { getValidateUrl } from "../../utils/endpoint.utils";
import { getSession } from "next-auth/react";
import { logger } from "../../utils/logger.utils";



const Validate = async (req: AnyProps, res: AnyProps) => {
  const url = getValidateUrl();
  const token = (await getSession({ req }) as any).accessToken;
  const payload = { label: "spaship-cli-token" };
  const response = await post<AnyProps>(url, payload, token);
  logger.info({ response })
  return res.send({ data: { token: response.token } });
};

export default Validate;
