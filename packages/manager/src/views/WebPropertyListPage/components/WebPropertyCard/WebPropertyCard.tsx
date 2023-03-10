import { ReactNode } from 'react';
import { Card, CardBody, CardFooter, CardTitle, Text, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import Link from 'next/link';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  isSelected?: boolean;
  urlPath?: string;
  urlQuery?: string;
};

export const WebPropertyCard = ({
  title,
  subtitle,
  children,
  footer,
  isSelected,
  urlPath,
  urlQuery
}: Props) => (
  <Card
    isSelectable
    isFullHeight
    style={{ height: '205px', overflow: 'hidden' }}
    isRounded
    className={css('pf-u-px-sm rounded-md transition hover:shadow-sm', {
      'selected-card': isSelected
    })}
  >
    <Link
      href={{
        pathname: urlPath,
        query: { propertyIdentifier: urlQuery }
      }}
    >
      <a className="text-decoration-none">
        <CardTitle>
          <Title headingLevel="h3" size="xl" className="capitalize">
            {title}
          </Title>
          <Text
            component="h1"
            style={{ fontSize: '16px', marginTop: '10px', color: '#808080', fontWeight: 500 }}
          >
            {subtitle}
          </Text>
        </CardTitle>
        <CardBody>{children}</CardBody>
        <CardFooter style={{ marginTop: '10px' }}>
          <Text className="pf-u-color-700" style={{ fontWeight: 'bold' }}>
            {footer}
          </Text>
        </CardFooter>
      </a>
    </Link>
  </Card>
);

WebPropertyCard.defaultProps = {
  children: null,
  title: '',
  subtitle: '',
  footer: '',
  isSelected: false,
  urlPath: '',
  urlQuery: ''
};
