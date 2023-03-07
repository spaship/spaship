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
    style={{ height: '200px', overflow: 'hidden' }}
    isRounded
    className={css('pf-u-px-sm rounded-md transition hover:shadow-sm', {
      'selected-card': isSelected
    })}
  >
    <CardTitle>
      <Link
        href={{
          pathname: urlPath,
          query: { propertyIdentifier: urlQuery }
        }}
      >
        <a className="text-decoration-none">
          <Title headingLevel="h3" size="xl" className="capitalize">
            {title}
          </Title>
        </a>
      </Link>
      <Text
        component="h1"
        style={{ fontSize: '16px', marginTop: '10px', color: '#808080', fontWeight: 500 }}
      >
        <a
          href={`http://${subtitle}`}
          target="_blank"
          className="text-decoration-none"
          rel="noreferrer"
        >
          {subtitle}
        </a>
      </Text>
    </CardTitle>
    <Link
      href={{
        pathname: urlPath,
        query: { propertyIdentifier: urlQuery }
      }}
    >
      <a className="text-decoration-none">
        <CardBody>{children}</CardBody>
        <CardFooter>
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
