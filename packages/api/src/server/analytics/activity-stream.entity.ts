export class ActivityStream {
  propertyIdentifier: string;

  action: string;

  props: Props;

  message: string;

  payload: string;

  source: string;

  createdBy: string;
}

export class Props {
  env: string;

  applicationIdentifier: string;
}

export enum Action {
  APPLICATION_DEPLOYED = 'APPLICATION_DEPLOYED',
  APPLICATION_DEPLOYMENT_STARTED = 'APPLICATION_DEPLOYMENT_STARTED',
  APPLICATION_DELETED = 'APPLICATION_DELETED',
  APIKEY_CREATED = 'APIKEY_CREATED',
  APIKEY_DELETED = 'APIKEY_DELETED',
  PROPERTY_CREATED = 'PROPERTY_CREATED',
  PROPERTY_UPDATED = 'PROPERTY_UPDATED',
  PROPERTY_DELETED = 'PROPERTY_DELETED',
  ENV_CREATED = 'ENV_CREATED',
  ENV_UPDATED = 'ENV_UPDATED',
  ENV_DELETED = 'ENV_DELETED',
  ENV_SYNCED = 'ENV_SYNCED'
}
