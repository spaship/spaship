import { ReactNode } from 'react';
import { Card, CardBody, CardFooter, CardTitle, Text, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  isSelected?: boolean;
};

export const WebPropertyCard = ({ title, subtitle, children, footer, isSelected }: Props) => (
  <Card
    isSelectable
    isFullHeight
    style={{ height: '200px', overflow: 'hidden' }}
    isRounded
    className={css('pf-u-px-sm rounded-md transition hover:shadow-sm', {
      'selected-card': isSelected
    })}
  >
    <CardTitle>
      <Title headingLevel="h3" size="xl" className="capitalize">
        {title}
      </Title>
      <Text component="h1" style={{ fontSize: '20px', marginTop: '10px', color: '#F4C145' }}>
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
  children: null,
  title: '',
  subtitle: '',
  footer: '',
  isSelected: false
};
