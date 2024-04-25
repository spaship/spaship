import { Banner } from '@app/components';
import { useGetDocumentPage } from '@app/services/documents';
import { Grid, GridItem } from '@patternfly/react-core';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import './Homepage.css';
import { DeploymentStatsCard } from './components/WebpropertiesTable/DeploymentStatsCard';
import { ReleaseNotesCard } from './components/WebpropertiesTable/ReleaseNotesCard';
import { Tutorials } from './components/WebpropertiesTable/Tutorials';
import { VideoGuidesCard } from './components/WebpropertiesTable/VideoGuidesCard';
import { WebpropertiesTable } from './components/WebpropertiesTable/WebpropertiesTable';

export const HomePage = (): JSX.Element => {
  const documentList = useGetDocumentPage();
  const name = useSession()?.data?.user?.name ?? 'Spaship User';
  return (
    <>
      <Head>
        <title>SPAship Home</title>
        <meta name="description" content="This is the home page description." />
      </Head>
      <Banner title={name} />
      <Grid>
        <GridItem span={7}>
          <WebpropertiesTable />
        </GridItem>

        <GridItem span={5}>
          <ReleaseNotesCard documentList={documentList.data} />

          <DeploymentStatsCard />
          <VideoGuidesCard />
          <Tutorials />
        </GridItem>
      </Grid>
    </>
  );
};
