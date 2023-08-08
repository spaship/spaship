/* eslint-disable react/jsx-key */
/* eslint-disable no-underscore-dangle */
import { useFormatDate } from '@app/hooks';
import { useGetWebPropActivityStream } from '@app/services/analytics';
import { TWebPropActivityStream } from '@app/services/analytics/types';
import { toPascalCase } from '@app/utils/toPascalConvert';
import {
  Grid,
  GridItem,
  Skeleton,
  Spinner,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import Link from 'next/link';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

type Props = {
  propertyIdentifier?: string;
  applicationIdentifier?: string;
  action?: string;
  isGlobal?: boolean;
};
type DeploymentKindProps = {
  activity: TWebPropActivityStream;
};
function extractBuildIdFromMessage(message: string): string | undefined {
  const regex = /\[(.*?)\]/;
  const matches = message.match(regex);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return '';
}
const activities = {
  APPLICATION_DEPLOYED: ({
    props,
    message,
    propertyIdentifier,
    isGlobal
  }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Deployment complete</span> for{' '}
      {isGlobal ? propertyIdentifier : ''}{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment within{' '}
      {message.split(' ')[3]}s{' '}
      <Link
        href={{
          pathname: '/properties/[propertyIdentifier]/[spaProperty]',
          query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
        }}
      >
        view details
      </Link>
    </Text>
  ),

  APPLICATION_DEPLOYMENT_STARTED: ({
    props,
    propertyIdentifier
  }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Deployment started</span> for {propertyIdentifier}{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.
      <Link
        href={{
          pathname: '/properties/[propertyIdentifier]/[spaProperty]',
          query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
        }}
      >
        view details
      </Link>
    </Text>
  ),
  APPLICATION_DEPLOYMENT_PROCESSING: ({
    props,
    propertyIdentifier
  }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Deployment processing</span> for {propertyIdentifier}{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.
      <Link
        href={{
          pathname: '/properties/[propertyIdentifier]/[spaProperty]',
          query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
        }}
      >
        view details
      </Link>
    </Text>
  ),
  APPLICATION_DEPLOYMENT_FAILED: ({
    props,
    propertyIdentifier
  }: TWebPropActivityStream): JSX.Element => (
    // "message": "NA",
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Deployment Failed</span> for {propertyIdentifier}{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.
      <Link
        href={{
          pathname: '/properties/[propertyIdentifier]/[spaProperty]',
          query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
        }}
      >
        view details
      </Link>
    </Text>
  ),

  APPLICATION_DEPLOYMENT_TIMEOUT: ({
    props,
    propertyIdentifier
  }: TWebPropActivityStream): JSX.Element => (
    //  "message": "Deployment Timeout [product360-catalog-product360-catalog-staging-2] [Workflow 3.0]",
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Deployment Timeout</span> for {propertyIdentifier}{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.
      <Link
        href={{
          pathname: '/properties/[propertyIdentifier]/[spaProperty]',
          query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
        }}
      >
        view details
      </Link>
    </Text>
  ),
  APPLICATION_BUILD_STARTED: ({
    props,
    propertyIdentifier,
    payload
  }: TWebPropActivityStream): JSX.Element => {
    const buildId = payload === 'NA' ? '' : JSON.parse(payload).buildName;
    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}>Build started </span>with{' '}
        <span style={{ fontWeight: '600' }}> ID : {buildId}</span> for {propertyIdentifier}{' '}
        <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env} </span> environment{' '}
        <Link
          style={{ textDecoration: 'underline' }}
          href={{
            pathname: '/properties/[propertyIdentifier]/[spaProperty]',
            query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
          }}
        >
          view details
        </Link>
      </Text>
    );
  },
  APPLICATION_BUILD_FINISHED: ({
    props,
    message,
    propertyIdentifier
  }: TWebPropActivityStream): JSX.Element => {
    const buildId = extractBuildIdFromMessage(message);

    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}> Build completed </span> with{' '}
        <span style={{ fontWeight: '600' }}>ID : {buildId}</span> for {propertyIdentifier}{' '}
        <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env} </span> environment within{' '}
        {message.split(' ')[3]} s
        <Link
          href={{
            pathname: '/properties/[propertyIdentifier]/[spaProperty]',
            query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
          }}
        >
          view details
        </Link>
      </Text>
    );
  },
  APPLICATION_BUILD_FAILED: ({
    props,
    message,
    propertyIdentifier
  }: TWebPropActivityStream): JSX.Element => {
    const buildId = extractBuildIdFromMessage(message);
    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}> Build failed </span> with{' '}
        <span style={{ fontWeight: '600' }}>ID : {buildId}</span> for {propertyIdentifier}{' '}
        <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env} </span> environment.
        <Link
          href={{
            pathname: '/properties/[propertyIdentifier]/[spaProperty]',
            query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
          }}
        >
          view details
        </Link>
      </Text>
    );
  },
  APPLICATION_BUILD_TERMINATED: ({
    props,
    propertyIdentifier,
    message
  }: TWebPropActivityStream): JSX.Element => {
    const buildId = extractBuildIdFromMessage(message);
    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}> Build terminated </span> with{' '}
        <span style={{ fontWeight: '600' }}>ID : {buildId}</span> for {propertyIdentifier}{' '}
        <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env} </span> environment.
        <Link
          href={{
            pathname: '/properties/[propertyIdentifier]/[spaProperty]',
            query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
          }}
        >
          view details
        </Link>
      </Text>
    );
  },
  PROPERTY_CREATED: ({ props, propertyIdentifier }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}> {propertyIdentifier} </span> has been created.{' '}
      <Link
        href={{
          pathname: '/properties/[propertyIdentifier]/[spaProperty]',
          query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
        }}
      >
        view details
      </Link>
    </Text>
  ),
  APIKEY_CREATED: ({ props, propertyIdentifier }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}> API key created </span> for {propertyIdentifier} for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.
    </Text>
  ),
  APIKEY_DELETED: ({ props, propertyIdentifier }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}> API key deleted </span> for {propertyIdentifier} for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.
    </Text>
  ),
  ENV_SYNCED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}> Sync completed</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.
    </Text>
  ),
  APPLICATION_DELETED: ({ props, message }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier} has been deleted</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env}</span> for Misc: {message}
    </Text>
  ),
  ENV_CREATED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>{props.env}</span> environment has been created.
    </Text>
  ),
  ENV_DELETED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>{props.env}</span> environment has been deleted.
    </Text>
  ),
  PERMISSION_CREATED: ({ message }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>
        {toPascalCase(message.split(' ')[0]).replace('_', ' ')}
      </span>{' '}
      access has been {message.split(' ')[2]} for {message.split(' ')[4]}
    </Text>
  ),
  PERMISSION_DELETED: ({ message }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>
        {toPascalCase(message.split(' ')[0]).replace('_', ' ')}
      </span>{' '}
      access has been {message.split(' ')[2]} for {message.split(' ')[4]}
    </Text>
  ),
  APPLICATION_CONFIG_UPDATED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Configuration Updated</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> in{' '}
      <span style={{ fontWeight: '600' }}>{props.env}</span> env.
    </Text>
  )
} as any;

const DeploymentKind = ({ activity }: DeploymentKindProps) => {
  if (Object.prototype.hasOwnProperty.call(activities, activity.action)) {
    return activities[activity.action](activity);
  }
  return <Text component={TextVariants.small}>Activity message - {activity.message}</Text>;
};

export const ActivityStream = ({
  propertyIdentifier = '',
  applicationIdentifier = '',
  action,
  isGlobal = false
}: Props): JSX.Element => {
  const { isLoading, isSuccess, data, isFetchingNextPage, fetchNextPage } =
    useGetWebPropActivityStream(propertyIdentifier, applicationIdentifier, action);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);
  const formatDate = useFormatDate();

  return (
    <>
      {isLoading && <Spinner isSVG aria-label="Activity stream loading" />}
      {isSuccess &&
        data.pages?.map((page) =>
          page.map((activity: TWebPropActivityStream) => {
            const modifiedActivity = { ...activity, isGlobal };

            return (
              <Grid hasGutter className="pf-u-mb-sm">
                <GridItem span={2}>
                  <div>
                    <p
                      // className="pf-u-md-sm"
                      style={{
                        color: '#151515',
                        fontFamily: 'Red Hat Display',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '24px'
                      }}
                    >
                      {formatDate(activity.createdAt, 'hh:mm a')}
                    </p>
                    <p
                      style={{
                        fontFamily: 'Red Hat Display',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#6A6E73'
                      }}
                    >
                      {formatDate(activity.createdAt, 'MMM DD YYYY')}
                    </p>
                  </div>
                </GridItem>

                <GridItem className="pf-u-mt-xs" span={1}>
                  {activity.action.includes('FAIL') ||
                  activity.action.includes('TERMINATED') ||
                  activity.action.includes('TIMEOUT') ||
                  activity.action.includes('DELETED') ? (
                    <ExclamationCircleIcon
                      style={{
                        width: '20px',
                        height: '20px',
                        color: '#C9190B'
                      }}
                    />
                  ) : (
                    <CheckCircleIcon
                      style={{
                        width: '20px',
                        height: '20px',
                        color: '#3E8635'
                      }}
                    />
                  )}
                </GridItem>
                <GridItem span={8}>
                  <p
                    style={{
                      fontFamily: 'Red Hat Display',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#000',
                      lineHeight: '24px'
                    }}
                  >
                    <TextContent className="pf-u-mb-sm">
                      <DeploymentKind activity={modifiedActivity} />
                    </TextContent>
                  </p>
                </GridItem>
              </Grid>
            );
          })
        )}
      {isFetchingNextPage &&
        Array.from(Array(5).keys()).map((key) => (
          <TextContent key={key} className="pf-u-m-md">
            <Skeleton width="80%" fontSize="md" screenreaderText="Loading activity stream" />
          </TextContent>
        ))}
      <div ref={ref} />
    </>
  );
};
ActivityStream.defaultProps = {
  propertyIdentifier: '',
  applicationIdentifier: '',
  action: '',
  isGlobal: false
};
