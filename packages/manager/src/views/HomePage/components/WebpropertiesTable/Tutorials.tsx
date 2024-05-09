/* eslint-disable react/no-array-index-key */

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
          <ul key={index}>
            <li key={index}>
              <a href={tutorial.link} target="_blank" rel="noreferrer">
                {tutorial.title}
              </a>
            </li>
          </ul>
        ))}
      </ul>
    </CardBody>
  </Card>
);
