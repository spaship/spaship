import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import {
  Button,
  EmptyState,
  EmptyStateIcon,
  Flex,
  FlexItem,
  Gallery,
  GalleryItem,
  PageSection,
  SearchInput,
  Select,
  SelectOption,
  SelectVariant,
  Split,
  SplitItem,
  Title
} from '@patternfly/react-core';
import { CubesIcon, PlusIcon } from '@patternfly/react-icons';

import { useGetUniqueWebProperties } from '@app/services/webProperty';
import { useGetDeploymentCounts } from '@app/services/analytics';
import { Banner } from '@app/components';
import { useDebounce, useToggle } from '@app/hooks';

import { WebPropertyCard } from './components/WebPropertyCard';
import { WebPropertyCardSkeleton } from './components/WebPropertyCardSkeleton';

const MY_PROPERTY_LABEL = 'My Properties';

export const WebPropertyListPage = (): JSX.Element => {
  const { data: session } = useSession();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useToggle();
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const webProperties = useGetUniqueWebProperties();
  const webPropertyDeloymentCount = useGetDeploymentCounts();

  // loading state skeletion cards
  if (webProperties.isLoading) {
    return (
      <>
        <Banner>
          <Title headingLevel="h1" size="2xl">
            Web Properties
          </Title>
        </Banner>
        <PageSection isCenterAligned isWidthLimited className="pf-u-px-3xl">
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

  // search filter debounced
  const filteredWebProperties = webProperties?.data?.filter(({ propertyName, createdBy }) => {
    if (filter === MY_PROPERTY_LABEL && createdBy !== session?.user.email) {
      return false;
    }
    return propertyName.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
  });

  const isWebPropertiesEmpty = filteredWebProperties?.length === 0;

  return (
    <>
      <Banner>
        <Title headingLevel="h1" size="2xl">
          Web Properties
        </Title>
      </Banner>
      <PageSection isCenterAligned isWidthLimited className="pf-u-px-3xl">
        <Split hasGutter className="pf-u-mb-md">
          <SplitItem className="pf-u-w-33">
            <SearchInput
              placeholder="Search by name"
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              onClear={() => setSearchTerm('')}
            />
          </SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            <Select
              variant={SelectVariant.single}
              aria-label="filter Input"
              onToggle={setIsFilterOpen.toggle}
              onSelect={(e, value) => {
                setFilter(value as string);
                setIsFilterOpen.off();
              }}
              selections={filter}
              isOpen={isFilterOpen}
              aria-labelledby="filter"
            >
              {[
                <SelectOption key={0} value="All Properties" />,
                <SelectOption key={1} value={MY_PROPERTY_LABEL} />
              ]}
            </Select>
          </SplitItem>
        </Split>
        {/* if call fails or if its empty */}
        {!webProperties.isSuccess || isWebPropertiesEmpty ? (
          <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h4" size="lg">
              {isWebPropertiesEmpty ? 'No web property found' : 'Something went wrong!!'}
            </Title>
            <Link passHref href="/properties/new/">
              <Button variant="primary">Add a web property</Button>
            </Link>
          </EmptyState>
        ) : (
          <Gallery hasGutter>
            {/* Add A Property Card */}
            <GalleryItem>
              <Link href="/properties/new">
                <a className="text-decoration-none">
                  <WebPropertyCard>
                    <Flex
                      direction={{ default: 'column' }}
                      justifyContent={{ default: 'justifyContentCenter' }}
                      alignItems={{ default: 'alignItemsCenter' }}
                    >
                      <FlexItem>
                        <Button
                          isLarge
                          style={{ borderRadius: '100%', width: '80px', height: '80px' }}
                        >
                          <PlusIcon />
                        </Button>
                      </FlexItem>
                      <FlexItem>
                        <Title headingLevel="h6">New Web Property</Title>
                      </FlexItem>
                    </Flex>
                  </WebPropertyCard>
                </a>
              </Link>
            </GalleryItem>
            {/* List of Properties */}
            {filteredWebProperties?.map(({ propertyName, propertyTitle, url }) => (
              <GalleryItem key={propertyName}>
                <WebPropertyCard
                  title={propertyTitle}
                  subtitle={url}
                  footer={`${webPropertyDeloymentCount?.data?.[propertyName] || 0} Deployment(s)`}
                />
              </GalleryItem>
            ))}
          </Gallery>
        )}
      </PageSection>
    </>
  );
};
