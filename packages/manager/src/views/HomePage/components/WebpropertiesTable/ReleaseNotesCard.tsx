import { Card, CardBody, CardHeader } from '@patternfly/react-core';
import { InfoAltIcon } from '@patternfly/react-icons';

export const ReleaseNotesCard = ({ documentList }: any): JSX.Element => (
  <Card className="pf-u-my-md pf-u-mr-md">
    <CardHeader className="card-header">Latest release notes</CardHeader>
    <CardBody className="release-note-font">
      {/* TODO: Replace with release note string */}
      <InfoAltIcon color="blue" />
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industry&apos;s standard dummy text ever since the 1500sn remaining essentially
      unchanged.
      <a href={documentList?.banner[0]?.link}> Read more.</a>
    </CardBody>
  </Card>
);
