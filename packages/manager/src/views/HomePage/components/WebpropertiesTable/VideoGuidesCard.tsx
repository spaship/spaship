import { env } from '@app/config/env';
import { pageLinks } from '@app/links';
import { Card, CardBody, CardHeader, Grid, GridItem, SplitItem } from '@patternfly/react-core';

export const VideoGuidesCard = (): JSX.Element => {
  const videos = [
    {
      title: 'SPAship Manager and CLI Guide',
      link: env.PUBLIC_SPASHIP_MANAGER_CLI_GUIDE
    },
    {
      title: 'Containerized deployments complete workflow',
      link: env.PUBLIC_CONTAINERIZED_DEPLOYMENTS_WORKFLOW_VIDEO
    },
    {
      title: 'SPAship CLI Instruction',
      link: env.PUBLIC_SPASHIP_CLI_INSTRUCTIONS
    }
  ];

  return (
    <Card className="pf-u-my-md pf-u-mr-md">
      <CardHeader>
        <SplitItem className="card-header" isFilled>
          Video Guides
        </SplitItem>
        <SplitItem>
          <a href={pageLinks.documentsPage}>see all videos</a>
        </SplitItem>
      </CardHeader>
      <CardBody>
        <Grid hasGutter>
          {videos.map((video, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <GridItem key={index} span={4}>
              <Card isRounded isPlain>
                <div className="video-panel pf-u-p-xl">
                  <a href={video.link} target="_blank" rel="noreferrer">
                    <img src="./img/play-button.svg" className="play-button" alt="Play Button" />
                  </a>
                </div>
                <a className="video-panel-link" href={video.link} target="_blank" rel="noreferrer">
                  {video.title}
                </a>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </CardBody>
    </Card>
  );
};
