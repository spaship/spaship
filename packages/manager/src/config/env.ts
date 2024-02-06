export const env = {
  PUBLIC_SPASHIP_ORCHESTRATOR_BASE_URL: process.env.NEXT_PUBLIC_SPASHIP_API_BASE_URL,
  PUBLIC_GITHUB_URL: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/spaship/spaship',
  PUBLIC_DOC_URL: process.env.NEXT_PUBLIC_DOC_URL || 'https://spaship.io',
  PUBLIC_SPASHIP_GUIDE:
    process.env.NEXT_PUBLIC_SPASHIP_GUIDE || 'https://spaship.io/docs/introduction',
  PUBLIC_SPASHIP_REPORT_BUG:
    process.env.NEXT_PUBLIC_SPASHIP_REPORT_BUG ||
    'https://github.com/spaship/spaship/issues/new?assignees=&labels=bug&template=bug-report.md&title=%5BBug%5D%3A',
  PUBLIC_SPASHIP_INTRO_VIDEO_URL: process.env.NEXT_PUBLIC_SPASHIP_INTRO_VIDEO_URL || '',

  // GitHub (https://github.com/organizations/spaship/settings/applications)
  SPASHIP_AUTH_GITHUB_ID: process.env.SPASHIP_AUTH__GITHUB_ID || '',
  SPASHIP_AUTH_GITHUB_SECRET: process.env.SPASHIP_AUTH__GITHUB_SECRET || '',
  // GitLab (https://gitlab.cee.redhat.com/groups/spaship/-/settings/applications)
  SPASHIP_AUTH_GITLAB_CLIENT_ID: process.env.SPASHIP_AUTH__GITLAB_CLIENT_ID || '',
  SPASHIP_AUTH_GITLAB_CLIENT_SECRET: process.env.SPASHIP_AUTH__GITLAB_CLIENT_SECRET || '',

  // Google (https://console.cloud.google.com/apis/credentials?project=spaship)
  SPASHIP_AUTH_GOOGLE_CLIENT_ID: process.env.SPASHIP_AUTH__GOOGLE_CLIENT_ID || '',
  SPASHIP_AUTH_GOOGLE_CLIENT_SECRET: process.env.SPASHIP_AUTH__GOOGLE_CLIENT_SECRET || '',

  // Keycloak (https://auth.dev.redhat.com/auth/realms/EmployeeIDP)
  SPASHIP_AUTH_KEYCLOAK_ID: process.env.SPASHIP_AUTH__KEYCLOAK_ID || '',
  SPASHIP_AUTH_KEYCLOAK_ISSUER: process.env.SPASHIP_AUTH__KEYCLOAK_ISSUER || '',
  SPASHIP_AUTH_KEYCLOAK_SECRET: process.env.SPASHIP_AUTH__KEYCLOAK_SECRET || '',
  SPASHIP_AUTH_KEYCLOAK_REFRESH_TOKEN_URL:
    process.env.SPASHIP_AUTH__KEYCLOAK_REFRESH_TOKEN_URL || '',

  // feedback form
  PUBLIC_SPASHIP_FEEDBACK_FORM_URL: process.env.NEXT_PUBLIC_SPASHIP_FEEDBACK_FORM_URL || '',

  // FAQ's document
  PUBLIC_SPASHIP_FAQ_URL: process.env.NEXT_PUBLIC_SPASHIP_FAQ_URL || '',

  // Lighthouse report document
  PUBLIC_SPASHIP_LIGHTHOUSE_URL: process.env.NEXT_PUBLIC_SPASHIP_LIGHTHOUSE_URL || '',

  // gitbroker url
  PUBLIC_SPASHIP_GIT_BROKER_URL: process.env.NEXT_PUBLIC_SPASHIP_GIT_BROKER_URL || ''
};
