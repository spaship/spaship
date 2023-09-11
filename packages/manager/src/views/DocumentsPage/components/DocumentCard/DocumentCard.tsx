import { ReactNode } from 'react';
import { Card, CardBody, CardFooter, CardTitle, Text, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { PlayIcon } from '@patternfly/react-icons';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  linkhere?: string;
  isIcon?: boolean;
  target?: string;
};

export const DocumentCard = ({
  title,
  subtitle,
  children,
  footer,
  linkhere,
  isIcon,
  target
}: Props) => (
  <a
    href={linkhere}
    target={target}
    rel="noreferrer"
    style={{ textDecoration: 'none', color: 'black' }}
  >
    <Card
      isSelectable
      isFullHeight
      style={{ height: '205px', overflow: 'hidden' }}
      isRounded
      className={css('pf-u-px-sm rounded-md transition hover:shadow-sm')}
    >
      <CardTitle>
        <Title headingLevel="h3" size="lg" className="capitalize">
          {isIcon ? <PlayIcon style={{ marginRight: '10px', fontSize: '15px' }} /> : null}
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
  linkhere: '',
  isIcon: false,
  target: '_blank'
};
