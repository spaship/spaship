import { pageLinks } from '@app/links';
import {
  Bullseye,
  Button,
  Stack,
  StackItem,
  Text,
  Title,
  TitleSizes
} from '@patternfly/react-core';
import Link from 'next/link';
import Head from 'next/head';

export const HomePage = (): JSX.Element => (
  <Bullseye>
    <Head>
      <title>SPAship Home</title>
      <meta name="description" content="This is the home page description." />
    </Head>
    <Stack hasGutter className="x-y-center">
      <StackItem style={{ textAlign: 'center' }}>
        <Title headingLevel="h1" size={TitleSizes['4xl']} style={{ fontSize: '2.4rem' }}>
          develop fast ·{' '}
          <span style={{ color: 'var(--spaship-global--Color--primary-blue)' }}>deploy faster</span>
        </Title>
        <Text className="pf-u-mt-sm pf-u-color-400">
          SPAship is a open source platform for deploying, integrating, and managing single-page
          apps (SPAs).
        </Text>
      </StackItem>
      <StackItem>
        <Link href={pageLinks.webPropertyListPage}>
          <a>
            <Button>Get Started</Button>
          </a>
        </Link>
      </StackItem>
    </Stack>
  </Bullseye>
);
