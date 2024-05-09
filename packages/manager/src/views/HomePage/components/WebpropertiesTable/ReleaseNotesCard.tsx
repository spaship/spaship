import { Card, CardBody, CardHeader, Split, SplitItem } from '@patternfly/react-core';
import { InfoAltIcon } from '@patternfly/react-icons';

export const ReleaseNotesCard = ({ documentList }: any): JSX.Element => (
  <Card className="pf-u-my-md pf-u-mr-md">
    <CardHeader className="card-header">Latest release notes</CardHeader>
    <CardBody className="release-note-font">
      {/* TODO: Replace with release note string */}
      <Split>
        <SplitItem className="pf-u-mx-sm">
          <InfoAltIcon color="#0066CC" />
        </SplitItem>
        <SplitItem>
          This release primarily focuses on the release of Openshift Console logs display for Static
          Deployments and the Implementation of automated symbolic link creation along with some bug
          fixes on SPAship. More details are available
          <a href={documentList?.banner[0]?.link} target="_blank" rel="noreferrer">
            {' '}
            here.
          </a>
        </SplitItem>
      </Split>
    </CardBody>
  </Card>
);
