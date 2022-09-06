import { ReactNode } from 'react';
import { Card, CardBody, CardFooter, CardTitle, Text, Title } from '@patternfly/react-core';

type Props = {
  title: ReactNode;
  subtitle: ReactNode;
  children?: ReactNode;
  footer: ReactNode;
};

export const WebPropertyCard = ({ title, subtitle, children, footer }: Props) => (
  <Card
    isSelectable
    isFullHeight
    style={{ height: '200px' }}
    isRounded
    className="pf-u-px-sm rounded-md transition hover:shadow-sm"
  >
    <CardTitle>
      <Title headingLevel="h3" size="xl">
        {title}
      </Title>
      <Text component="small" className="pf-u-color-400">
        {subtitle}
      </Text>
    </CardTitle>
    <CardBody>{children}</CardBody>
    <CardFooter>
      <Text className="pf-u-color-400">{footer}</Text>
    </CardFooter>
  </Card>
);

WebPropertyCard.defaultProps = {
  children: null
};
