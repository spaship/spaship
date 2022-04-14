export interface Properties {
    webprop: AnyProps;
}

export interface ContextProps {
    contex: AnyProps;
}

export interface WebProps {
    id: string;
    webPropertyName: string;
    count: string;
}

export interface SPAProps {
    id: string;
    count: string;
    spaName: string;
    propertyName: string;
    contextPath: string;
}

export interface ActivityProps {
    id: string;
    spaName: string;
    code: string;
    envs: string;
    branch: string;
    createdAt: string;
    propertyName: string;
}

export interface SPAIndexProps {
    activites: Properties,
    totalDeployments: Properties,
    monthlyDeployments: Properties,
}

export type AnyProps<PropsType = any> = PropsType