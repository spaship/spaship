import { ReactNode } from 'react';
import { Card, CardBody, CardFooter, CardTitle, Text, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  linkhere?: string;
};

export const DocumentCard = ({ title, subtitle, children, footer, linkhere }: Props) => (
  <a
    href={linkhere}
    target="_blank"
    rel="noreferrer"
    style={{ textDecoration: 'none', color: 'black' }}
  >
    <Card
      isSelectable
      isFullHeight
      style={{ height: '200px', overflow: 'hidden' }}
      isRounded
      className={css('pf-u-px-sm rounded-md transition hover:shadow-sm')}
    >
      <CardTitle>
        <Title headingLevel="h3" size="xl" className="capitalize">
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
  </a>
);

DocumentCard.defaultProps = {
  children: null,
  title: '',
  subtitle: '',
  footer: '',
  linkhere: ''
};
