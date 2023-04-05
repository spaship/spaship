import { Banner } from '@app/components';
import { useGetDocumentPage } from '@app/services/documents';
import { Gallery, GalleryItem, PageSection, Title } from '@patternfly/react-core';
import { DocumentCard } from './components/DocumentCard';

export const DocumentsPage = (): JSX.Element => {
  const data = useGetDocumentPage();
  return (
    <>
      <Banner title="Documents" />
      {Object.keys(data?.data || {}).map((section) => (
        <>
          <Title headingLevel="h1" style={{ marginLeft: '100px', marginTop: '20px' }}>
            {section}
          </Title>
          <PageSection isCenterAligned isWidthLimited className="pf-u-px-3xl">
            <Gallery hasGutter>
              {data?.data?.[section]?.map(({ title, link, tags, isVideo }) => (
                <GalleryItem key={title}>
                  <DocumentCard title={title} href={link} footer={tags} isIcon={isVideo} />
                </GalleryItem>
              ))}
            </Gallery>
          </PageSection>
        </>
      ))}
    </>
  );
};
