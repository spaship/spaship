import { AnyProps } from "../../components/models/props";
import { post } from "../../utils/api.utils";
import { getOnboardWebpropertyUrl } from "../../utils/endpoint.utils";

const WebPropertyOnboard = async (req: AnyProps, res: AnyProps) => {
  const url = getOnboardWebpropertyUrl();
  const propertyType = {
    operator: "operator",
  };
  const payload = {
    property: getProperty(req),
    env: getEnv(req),
    namespace: getNamespace(req),
    type: propertyType.operator,
  };
  const response = await post<AnyProps>(url, payload);
  return res.send({ data: { response } });
};

export default WebPropertyOnboard;

function getNamespace(req: any) {
  return req.body.env;
}

function getEnv(req: any) {
  return req.body.env;
}

function getProperty(req: any) {
  return req.body.property;
}
