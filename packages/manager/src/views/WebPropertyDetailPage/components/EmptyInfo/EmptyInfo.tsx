import { env } from '@app/config/env';
import { pageLinks } from '@app/links';
import {
  CodeBlock,
  CodeBlockCode,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  List,
  ListItem,
  Text,
  Title,
  ClipboardCopy
} from '@patternfly/react-core';
import {
  AutomationIcon,
  BundleIcon,
  CogIcon,
  CubeIcon,
  CubesIcon,
  KeyIcon,
  PficonTemplateIcon,
  PlusIcon
} from '@patternfly/react-icons';
import Link from 'next/link';

type Props = {
  propertyIdentifier: string;
};

export const EmptyInfo = ({ propertyIdentifier }: Props): JSX.Element => (
  <EmptyState variant={EmptyStateVariant.large}>
    <EmptyStateIcon icon={CubesIcon} />
    <Title headingLevel="h4" size="lg">
      No SPA Deployed yet
    </Title>
    <EmptyStateBody>
      Hey, seems like there are no SPAs deployed yet. Here are some things you can do to get
      started:
      <List isPlain>
        <ListItem icon={<PlusIcon />}>
          Create a new environment
          <Link
            href={{
              pathname: pageLinks.webPropertySettingPage,
              query: { propertyIdentifier }
            }}
          >
            <a>
              <Text>(Environment Configuration)</Text>
            </a>
          </Link>
        </ListItem>
        <ListItem icon={<PficonTemplateIcon />}>
          Generate API Key
          <Link
            href={{
              pathname: pageLinks.webPropertySettingPage,
              query: { propertyIdentifier }
            }}
          >
            <a>
              <Text>(Environment Configuration)</Text>
            </a>
          </Link>
        </ListItem>
        <ListItem icon={<CogIcon />}>Install spaship cli in your local system</ListItem>
        <ListItem icon={<KeyIcon />}>Setup your environment</ListItem>
        <CodeBlock>
          <CodeBlockCode>
            <ClipboardCopy hoverTip="Copy" clickTip="Copied" variant="inline-compact" isCode>
              {`spaship env --name=<new-env-name> --url=${window.location.origin}/api/v1/applications/deploy/${propertyIdentifier}/<env-name> --apikey=<your-api-key>`}
            </ClipboardCopy>
          </CodeBlockCode>
        </CodeBlock>
        <ListItem icon={<AutomationIcon />}>Initialize spaship.yaml </ListItem>
        <CodeBlock>
          <CodeBlockCode>
            <ClipboardCopy hoverTip="Copy" clickTip="Copied" variant="inline-compact" isCode>
              spaship init
            </ClipboardCopy>
          </CodeBlockCode>
        </CodeBlock>
        <ListItem icon={<BundleIcon />}>Pack your build (npm pack)</ListItem>
        <CodeBlock>
          <CodeBlockCode>
            <ClipboardCopy hoverTip="Copy" clickTip="Copied" variant="inline-compact" isCode>
              npm pack
            </ClipboardCopy>
          </CodeBlockCode>
        </CodeBlock>
        <ListItem icon={<CubeIcon />}>Deploy your spa</ListItem>
        <CodeBlock>
          <CodeBlockCode>
            <ClipboardCopy hoverTip="Copy" clickTip="Copied" variant="inline-compact" isCode>
              {`spaship deploy --env=<env> <your-archive-file-name>`}
            </ClipboardCopy>
          </CodeBlockCode>
        </CodeBlock>
      </List>
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      <a target="_blank" href={env.PUBLIC_SPASHIP_GUIDE} rel="noreferrer">
        <img src="/img/spaship-logo.svg" alt="instruction" style={{ height: '25px' }} />
        <br />
        Instruction Guide
      </a>
    </EmptyStateSecondaryActions>
  </EmptyState>
);
