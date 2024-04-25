import { env } from '@app/config/env';
import { pageLinks } from '@app/links';
import { Card, CardBody, CardHeader, SplitItem } from '@patternfly/react-core';

const tutorialsData = [
  {
    title: 'SPAship Manager & CLI Guide',
    link: env.PUBLIC_SPASHIP_MANAGER_CLI_GUIDE
  },
  {
    title: 'On-Boarding to SPAship Cloud Native Version',
    link: env.PUBLIC_ONBOARDING_TO_CLOUD_LINK
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
