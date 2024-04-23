import { pageLinks } from '@app/links';
import { Card, CardBody, CardHeader, Grid, GridItem, SplitItem } from '@patternfly/react-core';

export const VideoGuidesCard = (): JSX.Element => {
  const videos = [
    {
      title: 'SPAship Manager and CLI Guide',
      link: 'https://drive.google.com/file/d/150OyktZdmqMXKwNS1mDkqIo7ZvgyCCGp/view'
    },
    {
      title: 'Containerized deployments complete workflow',
      link: 'https://drive.google.com/file/d/1g-obdU_RT1kQOgDKM150s_eVyiYUElKa/view?usp=sharing'
    },
    {
      title: 'SPAship CLI Instruction',
      link: 'https://drive.google.com/file/d/1G4B8AKu_8M6fVEMd8WtXHgLhf__Xl2mt/view?usp=sharing'
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
