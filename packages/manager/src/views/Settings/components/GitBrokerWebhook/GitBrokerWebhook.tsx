import { env } from '@app/config/env';
import {
  Card,
  CardBody,
  CardTitle,
  ClipboardCopy,
  Split,
  SplitItem,
  Title
} from '@patternfly/react-core';

export const GitBrokerWebhook = () => (
  <Card>
    <CardTitle>
      <Title headingLevel="h6">Git-Broker Webhook URL</Title>
    </CardTitle>
    <CardBody>
      <Split>
        <SplitItem isFilled>
          <ClipboardCopy hoverTip="Copy" clickTip="Copied" isReadOnly>
            {env.PUBLIC_SPASHIP_GIT_BROKER_URL}
          </ClipboardCopy>
          <p className="pf-u-my-md" style={{ color: '#6A6E73' }}>
            NOTE: Please add this link as a webhook in Gitlab to use git-broker, and use
            &apos;APIKey&apos; as the secret while configuring it.
          </p>
        </SplitItem>
      </Split>
    </CardBody>
  </Card>
);
