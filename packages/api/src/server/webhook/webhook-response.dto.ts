export class WebhookResponse {
  propertyIdentifier: string;

  action: string;

  actor: string;

  source: string;

  environment: string;

  application?: WebhookApplication;

  apiKey: WebhookApikey;

  webhook: WebhookDetails;

  message: string;

  triggeredAt: Date;
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
