import { ReactNode, useMemo } from 'react';
import {
  PageSection,
  Stack,
  StackItem,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Title,
  Flex,
  FlexItem
} from '@patternfly/react-core';
import Link, { LinkProps } from 'next/link';
import { ArrowLeftIcon } from '@patternfly/react-icons';
import { useRouter } from 'next/router';

interface Props {
  children?: ReactNode;
  backRef?: LinkProps['href'];
  title?: string;
}

// This is part of layout which renders a title
// A link to go back
// breadcrumb for navigation
export const Banner = ({ children, backRef, title }: Props): JSX.Element => {
  const { pathname, query, asPath } = useRouter();

  // TODO: apply a text transformer prop to show custom text
  const crumbs = useMemo(() => {
    let start = '';
    return pathname
      .split('/')
      .filter((val) => Boolean(val))
      .map((path) => {
        // if its query string
        if (path.charAt(0) === '[') {
          const key = query[path.substring(1, path.length - 1)];
          const crumb = { name: key, href: `${start}/${key}` };
          start += `/${key}`;
          return crumb;
        }

        const crumb = { name: path, href: `${start}/${path}` };
        start += `/${path}`;
        return crumb;
      });
  }, [pathname, query]);
  const isHomePath = asPath === '/' || asPath === '/home';
  return (
    <PageSection isWidthLimited isCenterAligned className=" pf-u-pt-lg">
      <Stack>
        <StackItem>
          <Breadcrumb>
            <BreadcrumbItem isActive={asPath === '/properties'}>
              <Link href="/home">
                <a>Home</a>
              </Link>
            </BreadcrumbItem>
            {crumbs.map(
              ({ href, name }) =>
                name !== 'home' && (
                  <BreadcrumbItem key={href} isActive={asPath === href} className="capitalize">
                    {asPath === href ? (
                      name
                    ) : (
                      <Link href={href}>
                        <a>{name}</a>
                      </Link>
                    )}
                  </BreadcrumbItem>
                )
            )}
          </Breadcrumb>
        </StackItem>
        <StackItem className="pf-u-mt-sm">
          <Flex
            alignItems={{ default: 'alignItemsCenter' }}
            spaceItems={{ default: 'spaceItemsSm' }}
          >
            {backRef && (
              <FlexItem>
                <Link href={backRef}>
                  <a>
                    <Button variant="link" className="pf-u-p-xs pf-u-pl-0">
                      <ArrowLeftIcon size="md" />
                    </Button>
                  </a>
                </Link>
              </FlexItem>
            )}
            {title && (
              <FlexItem>
                <Title headingLevel="h1" size="2xl" className="capitalize">
                  {isHomePath ? `Welcome ${title}` : title}
                </Title>
              </FlexItem>
            )}
            <FlexItem flex={{ default: 'flex_1' }}>{children}</FlexItem>
          </Flex>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

Banner.defaultProps = {
  backRef: '',
  title: '',
  children: null
};
