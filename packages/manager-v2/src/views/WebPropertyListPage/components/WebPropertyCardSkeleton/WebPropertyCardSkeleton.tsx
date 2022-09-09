import { Card, CardBody, CardFooter, CardTitle, Skeleton } from '@patternfly/react-core';

export const WebPropertyCardSkeleton = () => (
  <Card
    isSelectable
    isFullHeight
    style={{ height: '200px' }}
    isRounded
    className="pf-u-px-sm rounded-md transition hover:shadow-sm"
  >
    <CardTitle>
      <Skeleton width="50%" height="20px" className="pf-u-mb-sm" />
      <Skeleton width="25%" height="20px" />
    </CardTitle>
    <CardBody />
    <CardFooter>
      <Skeleton width="25%" height="20px" />
    </CardFooter>
  </Card>
);
