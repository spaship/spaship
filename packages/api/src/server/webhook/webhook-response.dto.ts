export class WebhookResponse {
  propertyIdentifier: string;

  action: string;

  sourceUser: string;

  source: string;

  environment: string;

  application?: WebhookApplication;

  apiKey: WebhookApikey;

  webhook: WebhookDetails;

  message: string;

  createdAt: Date;
}

export class WebhookApplication {
  name: string;

  ref: string;

  path: string;

  accessUrl: string;
}

export class WebhookApikey {
  label: string;

  shortKey: string;

  expirationDate: string;
}

export class WebhookDetails {
  name: string;

  actions: string;

  url: string;
}
