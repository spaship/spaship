import { Banner } from '@app/components';
import { useGetDocumentPage } from '@app/services/documents';
import { Card, CardTitle, Gallery, GalleryItem, PageSection } from '@patternfly/react-core';
import { DocumentCard } from './components/DocumentCard';

export const DocumentsPage = (): JSX.Element => {
  const data = useGetDocumentPage();
  const sections = Object.keys(data?.data || {}).filter((section) => section !== 'banner');
  return (
    <>
      <Banner title="Documents" />
      <div style={{ backgroundColor: '#15' }}>
        <Card className="pf-u-m-lg" isRounded>
          {sections.map((section) => (
            <>
              <CardTitle style={{ fontSize: '24px' }}>{section}</CardTitle>
              <PageSection isCenterAligned isWidthLimited>
                <Gallery hasGutter>
                  {data?.data?.[section]?.map(({ title, link, tags, isVideo }) => (
                    <GalleryItem key={title}>
                      <DocumentCard title={title} linkhere={link} footer={tags} isIcon={isVideo} />
                    </GalleryItem>
                  ))}
                </Gallery>
              </PageSection>
            </>
          ))}
        </Card>
      </div>
    </>
  );
};
