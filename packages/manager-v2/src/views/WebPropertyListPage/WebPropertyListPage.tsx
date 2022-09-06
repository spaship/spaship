import { Gallery, GalleryItem, PageSection } from '@patternfly/react-core';
import { useGetWebProperties } from '@app/services/webProperty';

import { WebPropertyCard } from './components/WebPropertyCard';
import { WebPropertyCardSkeleton } from './components/WebPropertyCardSkeleton';

export const WebPropertyListPage = (): JSX.Element => {
  const webProperties = useGetWebProperties();

  if (webProperties.isLoading) {
    return (
      <>
        <div
          style={{ height: '100px', background: 'var(--spaship-global--Color--spaship-gray)' }}
        />
        <PageSection
          isCenterAligned
          isWidthLimited
          className="pf-u-px-3xl"
          style={{ position: 'relative', bottom: '120px', background: 'none' }}
        >
          <Gallery hasGutter>
            {Array.apply(0, Array(3)).map((x, i) => (
              <GalleryItem key={`web-property-card-${i + 1}`}>
                <WebPropertyCardSkeleton />
              </GalleryItem>
            ))}
          </Gallery>
        </PageSection>
      </>
    );
  }

  return (
    <>
      <div style={{ height: '100px', background: 'var(--spaship-global--Color--spaship-gray)' }} />
      <PageSection
        isCenterAligned
        isWidthLimited
        className="pf-u-px-3xl"
        style={{ position: 'relative', bottom: '120px', background: 'none' }}
      >
        <Gallery hasGutter>
          {Array.apply(0, Array(5)).map((x, i) => (
            <GalleryItem key={`web-property-card-${i + 1}`}>
              <WebPropertyCard
                title="One Platform"
                subtitle="one.redhat.com"
                footer={`${i} Deployment${i > 1 ? 's' : ''}`}
              />
            </GalleryItem>
          ))}
        </Gallery>
      </PageSection>
    </>
  );
};
