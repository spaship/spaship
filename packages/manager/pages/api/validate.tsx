import { AnyProps } from "../../components/models/props";
import { post } from "../../utils/api.utils";
import { getValidateUrl } from "../../utils/endpoint.utils";

const Validate = async (req: AnyProps, res: AnyProps) => {
    const url = getValidateUrl();
    const payload = {};
    const response = await post<AnyProps>(url, payload);
    return res.send({ data: { token: response.token } });
}

export default Validate;