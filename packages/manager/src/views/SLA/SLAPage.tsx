import { Banner } from '@app/components';
import { PageSection } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

export const SLAPage = (): JSX.Element => (
  <div style={{ backgroundColor: '#15' }}>
    <Banner title="Service Level Agreement for SPAship" />

    <PageSection isCenterAligned isWidthLimited className="pf-u-m-lg pf-u-py-lg">
      <TableComposable aria-label="Simple table" variant="compact">
        <Thead noWrap>
          <Tr>
            <Th textCenter modifier="wrap">
              Service Level
            </Th>
            <Th textCenter modifier="wrap">
              Response Time(Business Hours IST)
            </Th>
            <Th textCenter modifier="wrap">
              Resolution Time(Business Hours IST)
            </Th>
            <Th textCenter modifier="wrap">
              Response Time(After Business Hours)
            </Th>
            <Th textCenter modifier="wrap">
              Resolution Time(After business hours)
            </Th>
            <Th textCenter modifier="wrap">
              Contact{' '}
            </Th>
            <Th textCenter modifier="wrap">
              Escalation
            </Th>
            <Th textCenter modifier="wrap">
              Description{' '}
            </Th>
            <Th textCenter modifier="wrap">
              Cases
            </Th>
            <Th textCenter modifier="wrap">
              RCA(Root cause analysis)
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Level 1</Td>
            <Td>0 - 2 hours</Td>
            <Td>2 hours</Td>
            <Td>8 hours</Td>
            <Td>12 hours</Td>
            <Td>
              <b>Email : </b>spaship-dev@redhat.com <br />
              <b>Slack : </b>forum-spaship - Internal Red Hat - Slack
            </Td>
            <Td>
              npatil@redhat.com
              <br />
              arbhatta@redhat.com
            </Td>
            <Td>
              Critical issue that impacts a high number of end users or critical business functions.
            </Td>
            <Td>
              <li>https://spaship.redhat.com is not reachable</li>
              <li>Unable to deploy application into Prod environment</li>
              <li>SPA of a Prod environment is not Reachable</li>
              <li>Prod environment is down.</li>
            </Td>
            <Td>1 business day</Td>
          </Tr>
          <Tr>
            <Td>Level 2</Td>
            <Td>2 - 4 hours</Td>
            <Td>4 hours</Td>
            <Td>10 hours</Td>
            <Td>1 Day</Td>

            <Td>
              <b>Email : </b>spaship-dev@redhat.com
              <br />
              <b>Slack : </b>forum-spaship - Internal Red Hat - Slack
            </Td>
            <Td>
              arbhatta@redhat.com
              <br />
              souchowd@redhat.com
            </Td>
            <Td>
              Significant issue that impacts some end users or non-critical business functions.
            </Td>
            <Td>
              <li>Unable to deploy application in any non prod environment.</li>
              <li>Login issues</li>
              <li>Hosted/ Internal apps (non prod) not accessible post Scheduled Maintenance.</li>
            </Td>
            <Td>3 business days</Td>
          </Tr>
          <Tr>
            <Td>Level 3 </Td>
            <Td>5 - 6 hours </Td>
            <Td>8 hours </Td>
            <Td>12 hours </Td>
            <Td>1 Day </Td>
            <Td>
              <b>Email : </b>spaship-dev@redhat.com
              <br />
              <b>Slack : </b>forum-spaship - Internal Red Hat - Slack
            </Td>
            <Td>
              souchowd@redhat.com
              <br />
              spaship-dev@redhat.com{' '}
            </Td>
            <Td>
              Minor issue that affects a small number of end users or non-critical business
              functions.{' '}
            </Td>
            <Td>
              <li>Deployed Chnage is not reflecting in some environments</li>
              <li>Can see the change from internal URL but not available in the external url</li>
              <li>Unable to find a document or guide</li>
            </Td>
            <Td>5 business days</Td>
          </Tr>
          <Tr>
            <Td>Level 4 </Td>
            <Td>&gt; 6 hours </Td>
            <Td>&gt; 8 hours </Td>
            <Td>1 Day </Td>
            <Td>2 Days </Td>
            <Td>
              <b>Email</b> : spaship-dev@redhat.com <br />
              <b>Slack</b> : forum-spaship - Internal Red Hat - Slack
            </Td>

            <Td>
              nmore@redhat.com
              <br />
              spaship-dev@redhat.com{' '}
            </Td>
            <Td>Low priority issue that does not impact end users or business functions. </Td>
            <Td>
              <li>Don&apos;t have access to SPAship or a particular property</li>
              <li>Need help in settup Up CI for SPAShip</li>
              <li>Property specific requirements.</li>
              <li>Publish a new SPA dir to Akamai</li>
            </Td>
            <Td>10 business days</Td>
          </Tr>
        </Tbody>
      </TableComposable>
    </PageSection>
  </div>
);
