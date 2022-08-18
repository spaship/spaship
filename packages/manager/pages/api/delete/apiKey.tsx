import { getSession } from "next-auth/react";
import { AnyProps } from "../../../components/models/props";
import { del } from "../../../utils/api.utils";
import { getDeleteApiKeyUrl } from "../../../utils/endpoint.utils";

const DeleteApiKey = async (req: AnyProps, res: AnyProps) => {
    const url = getDeleteApiKeyUrl();
    const token = (await getSession({ req }) as any).accessToken;
    const propertyName = getPropertyName(req);
    const shortKey = getShortKey(req);
    const deleteUrl = `${url}/${propertyName}/${shortKey}`
    const response = await del<AnyProps>(deleteUrl, {}, token);
    return res.send({ data: { response } });
};

export default DeleteApiKey;


function getPropertyName(req: any) {
    return req.body.propertyName;
}

function getShortKey(req: any) {
    return req.body.shortKey;
}

