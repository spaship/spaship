import { useGetDocumentPage } from '@app/services/documents';
import { Card, CardBody, CardHeader, Split, SplitItem } from '@patternfly/react-core';
import { InfoAltIcon } from '@patternfly/react-icons';

export const ReleaseNotesCard = ({ documentList }: any): JSX.Element => {
  const { data: docsData } = useGetDocumentPage();
  const releaseNote = docsData?.release?.[0];

  return (
    <Card className="pf-u-my-md pf-u-mr-md">
      <CardHeader className="card-header">Latest release notes</CardHeader>
      <CardBody className="release-note-font">
        {releaseNote ? (
          <Split>
            <SplitItem className="pf-u-mx-sm">
              <InfoAltIcon color="#0066CC" />
            </SplitItem>
            <SplitItem>
              {releaseNote.title}{' '}
              <a href={releaseNote.link} target="_blank" rel="noreferrer">
                here.
              </a>
            </SplitItem>
          </Split>
        ) : (
          <div>No release notes available.</div>
        )}
      </CardBody>
    </Card>
  );
};
