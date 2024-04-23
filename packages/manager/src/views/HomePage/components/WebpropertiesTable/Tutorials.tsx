import { pageLinks } from '@app/links';
import { Card, CardBody, CardHeader, SplitItem } from '@patternfly/react-core';

const tutorialsData = [
  {
    title: 'SPAship Manager & CLI Guide',
    link: 'https://drive.google.com/file/d/150OyktZdmqMXKwNS1mDkqIo7ZvgyCCGp/view'
  },
  {
    title: 'On-Boarding to SPAship Cloud Native Version',
    link: 'https://source.redhat.com/groups/public/spaship/blog_article/onboarding_to_spaship_cloud_native_version'
  }
];

export const Tutorials = (): JSX.Element => (
  <Card className="pf-u-my-md pf-u-mr-md">
    <CardHeader>
      <SplitItem className="card-header" isFilled>
        Tutorials
      </SplitItem>
      <SplitItem>
        <a href={pageLinks.documentsPage}>see all documentation</a>
      </SplitItem>
    </CardHeader>
    <CardBody>
      <ul>
        {tutorialsData.map((tutorial, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>
            <a href={tutorial.link} target="_blank" rel="noreferrer">
              {tutorial.title}
            </a>
          </li>
        ))}
      </ul>
    </CardBody>
  </Card>
);
