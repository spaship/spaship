import { AnyProps } from "../../components/models/props";
import { post } from "../../utils/api.utils";
import { getOnboardWebpropertyUrl } from "../../utils/endpoint.utils";
import { getSession } from "next-auth/react";

const WebPropertyOnboard = async (req: AnyProps, res: AnyProps) => {
    const url = getOnboardWebpropertyUrl();
    const userEmail = (await getSession({ req }) as any).user.email;
    const propertyType = {
        operator: "operator",
    };
    const payload = {
        "propertyTitle": getPropertyTitle(req),
        "propertyName": getPropertyName(req),
        "env": getEnv(req),
        "url": getUrl(req),
        "namespace": getNamespace(req),
        "type": propertyType.operator,
        "createdBy": userEmail
    };
    const response = await post<AnyProps>(url, payload);
    return res.send({ data: { response } });
}

export default WebPropertyOnboard;

function getNamespace(req: any) {
    return req.body.env;
}

function getEnv(req: any) {
    return req.body.env;
}

function getUrl(req: any) {
    return req.body.url;
}

function getPropertyName(req: any) {
    return req.body.propertyName;
}

function getPropertyTitle(req: any) {
    return req.body.propertyTitle;
}