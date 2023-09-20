import Link from 'next/link';
import { Bullseye, Button, Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import { pageLinks } from '@app/links';

export const StayTunedPage = (): JSX.Element => (
  <Bullseye>
    <Stack hasGutter className="x-y-center">
      <StackItem style={{ textAlign: 'center' }}>
        <Title headingLevel="h1" size={TitleSizes['4xl']} style={{ fontSize: '2.4rem' }}>
          Coming Soon ·{' '}
          <span style={{ color: 'var(--spaship-global--Color--primary-blue)' }}>Stay Tuned</span>
        </Title>
      </StackItem>
      <StackItem>
        <Link href={pageLinks.webPropertyListPage}>
          <a>
            <Button>Go to Web Property List</Button>
          </a>
        </Link>
      </StackItem>
    </Stack>
  </Bullseye>
);
