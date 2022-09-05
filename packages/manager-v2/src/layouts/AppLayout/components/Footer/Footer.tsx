import {
  Button,
  ButtonVariant,
  Divider,
  Flex,
  FlexItem,
  PageSection
} from '@patternfly/react-core';
import { GithubIcon, UserIcon } from '@patternfly/react-icons';
import { env } from '@app/config/env';

export const Footer = (): JSX.Element => (
  <PageSection>
    <Divider className="pf-u-mb-md" />
    <Flex justifyContent={{ default: 'justifyContentFlexEnd' }}>
      <FlexItem>
        <Button
          aria-label="contact us"
          variant={ButtonVariant.link}
          icon={<UserIcon />}
          href={env.PUBLIC_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          component="a"
        >
          Contact Us
        </Button>
      </FlexItem>
      <FlexItem>
        <Button
          aria-label="GitHub URL"
          variant={ButtonVariant.link}
          icon={<GithubIcon />}
          href={env.PUBLIC_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          component="a"
        >
          GitHub
        </Button>
      </FlexItem>
    </Flex>
  </PageSection>
);
