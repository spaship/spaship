/* eslint-disable no-nested-ternary */
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
  }: TWebPropActivityStream): JSX.Element => {
    const deploymentType = {
      Static: 'static',
      Containerized: 'containerized'
    };
    const deploymentTypeTab = {
      Containerized: 0,
      Static: 1
    };
    const initialTab = props.env.includes('ephemeral')
      ? 1 // setting 1 as eph is 2nd tab in web property page
      : props.type === deploymentType.Containerized
      ? deploymentTypeTab.Containerized
      : deploymentTypeTab.Static;

    const pathname = props.env.includes('ephemeral')
      ? '/properties/[propertyIdentifier]'
      : '/properties/[propertyIdentifier]/[spaProperty]';

    const query = {
      propertyIdentifier,
      spaProperty: props.applicationIdentifier,
      initialTab
    };

    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}>Deployment complete</span> for property :{' '}
        <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
        <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env} </span> environment within{' '}
        {message?.split(' ')[3]}s.&nbsp;
        {isGlobal && (
          <Link
            href={{
              pathname,
              query
            }}
          >
            view details
          </Link>
        )}
      </Text>
    );
  },

  APPLICATION_DEPLOYMENT_STARTED: ({
    props,
    propertyIdentifier,
    isGlobal,
    createdBy
  }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Deployment started</span> for property :{' '}
      <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment, initiated by&nbsp;
      {createdBy}.
      {isGlobal && (
        <Link
          href={{
            pathname: '/properties/[propertyIdentifier]/[spaProperty]',
            query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
          }}
        >
          view details
        </Link>
      )}
    </Text>
  ),

  APPLICATION_DEPLOYMENT_PROCESSING: ({
    props,
    propertyIdentifier,
    isGlobal
  }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Deployment processing</span> for property :{' '}
      <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.&nbsp;
      {isGlobal && (
        <Link
          href={{
            pathname: '/properties/[propertyIdentifier]/[spaProperty]',
            query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
          }}
        >
          view details
        </Link>
      )}
    </Text>
  ),
  APPLICATION_DEPLOYMENT_FAILED: ({
    props,
    propertyIdentifier,
    isGlobal
  }: TWebPropActivityStream): JSX.Element => (
    // "message": "NA",
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Deployment Failed</span> for property :{' '}
      <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.&nbsp;
      {isGlobal && (
        <Link
          href={{
            pathname: '/properties/[propertyIdentifier]/[spaProperty]',
            query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
          }}
        >
          view details
        </Link>
      )}
    </Text>
  ),

  APPLICATION_DEPLOYMENT_TIMEOUT: ({
    props,
    propertyIdentifier,
    isGlobal
  }: TWebPropActivityStream): JSX.Element => (
    //  "message": "Deployment Timeout [product360-catalog-product360-catalog-staging-2] [Workflow 3.0]",
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Deployment Timeout</span> for property :{' '}
      <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.&nbsp;
      {isGlobal && (
        <Link
          href={{
            pathname: '/properties/[propertyIdentifier]/[spaProperty]',
            query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
          }}
        >
          view details
        </Link>
      )}
    </Text>
  ),
  APPLICATION_BUILD_STARTED: ({
    props,
    propertyIdentifier,
    isGlobal,
    payload,
    createdBy
  }: TWebPropActivityStream): JSX.Element => {
    const buildId = payload === 'NA' ? '' : JSON.parse(payload).buildName;
    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}>Build started </span>with{' '}
        <span style={{ fontWeight: '600' }}> ID : {buildId}</span> for property :{' '}
        <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
        <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env} </span> environment by {createdBy}.
        {isGlobal && (
          <Link
            style={{ textDecoration: 'underline' }}
            href={{
              pathname: '/properties/[propertyIdentifier]/[spaProperty]',
              query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
            }}
          >
            view details
          </Link>
        )}
      </Text>
    );
  },
  APPLICATION_BUILD_FINISHED: ({
    props,
    message,
    propertyIdentifier,
    isGlobal
  }: TWebPropActivityStream): JSX.Element => {
    const buildId = extractBuildIdFromMessage(message);

    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}> Build completed </span> with{' '}
        <span style={{ fontWeight: '600' }}>ID : {buildId}</span> for {propertyIdentifier}{' '}
        <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env} </span> environment within{' '}
        {message?.split(' ')[3]}s.&nbsp;
        {isGlobal && (
          <Link
            href={{
              pathname: '/properties/[propertyIdentifier]/[spaProperty]',
              query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
            }}
          >
            view details
          </Link>
        )}
      </Text>
    );
  },
  APPLICATION_BUILD_FAILED: ({
    props,
    message,
    propertyIdentifier,
    isGlobal
  }: TWebPropActivityStream): JSX.Element => {
    const buildId = extractBuildIdFromMessage(message);
    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}> Build failed </span> with{' '}
        <span style={{ fontWeight: '600' }}>ID : {buildId}</span> for property :{' '}
        <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
        <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env} </span> environment.&nbsp;
        {isGlobal && (
          <Link
            href={{
              pathname: '/properties/[propertyIdentifier]/[spaProperty]',
              query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
            }}
          >
            view details
          </Link>
        )}
      </Text>
    );
  },
  APPLICATION_BUILD_TERMINATED: ({
    props,
    propertyIdentifier,
    isGlobal,
    message
  }: TWebPropActivityStream): JSX.Element => {
    const buildId = extractBuildIdFromMessage(message);
    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}> Build terminated </span> with{' '}
        <span style={{ fontWeight: '600' }}>ID : {buildId}</span> for property :{' '}
        <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
        <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env} </span> environment.&nbsp;
        {isGlobal && (
          <Link
            href={{
              pathname: '/properties/[propertyIdentifier]/[spaProperty]',
              query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
            }}
          >
            view details
          </Link>
        )}
      </Text>
    );
  },
  PROPERTY_CREATED: ({
    props,
    propertyIdentifier,
    isGlobal,
    createdBy
  }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}> Property : {propertyIdentifier} </span> has been created
      by {createdBy}.&nbsp;
      {isGlobal && (
        <Link
          href={{
            pathname: '/properties/[propertyIdentifier]/[spaProperty]',
            query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
          }}
        >
          view details
        </Link>
      )}
    </Text>
  ),
  APIKEY_CREATED: ({
    props,
    propertyIdentifier,
    createdBy
  }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}> API key created </span> for property :{' '}
      <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment by {createdBy}.
    </Text>
  ),
  APIKEY_DELETED: ({
    props,
    propertyIdentifier,
    createdBy
  }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}> API key deleted </span> for property :{' '}
      <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span>for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment by {createdBy}.
    </Text>
  ),
  ENV_SYNCED: ({ props, createdBy }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}> Sync completed</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment by {createdBy}
    </Text>
  ),
  APPLICATION_DELETED: ({ props, message }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier} has been deleted</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env}</span> for Misc: {message}
    </Text>
  ),
  ENV_CREATED: ({ props, createdBy }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>{props.env}</span> environment has been created by{' '}
      {createdBy}.
    </Text>
  ),
  ENV_DELETED: ({ props, createdBy }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>{props.env}</span> environment has been deleted by{' '}
      {createdBy}.
    </Text>
  ),
  PERMISSION_CREATED: ({ message, createdBy }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>
        {toPascalCase(message?.split(' ')[0]).replace('_', ' ')}
      </span>{' '}
      access has been {message?.split(' ')[2]} for {message?.split(' ')[4]}
      by {createdBy}.
    </Text>
  ),
  PERMISSION_DELETED: ({ message, createdBy }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>
        {toPascalCase(message?.split(' ')[0]).replace('_', ' ')}
      </span>{' '}
      access has been {message?.split(' ')[2]} for {message?.split(' ')[4]} by {createdBy}.
    </Text>
  ),
  APPLICATION_CONFIG_UPDATED: ({ props, createdBy }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Configuration </span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> in{' '}
      <span style={{ fontWeight: '600' }}>{props.env}</span> env has been successfully updated by{' '}
      {createdBy}
    </Text>
  ),

  APPLICATION_UNAVAILABLE: ({ props, propertyIdentifier }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}> Application unavailable</span> for property :{' '}
      <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.&nbsp;
    </Text>
  ),
  APPLICATION_AVAILABLE: ({ props, propertyIdentifier }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}> Application is live </span> for property :{' '}
      <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.&nbsp;
    </Text>
  ),
  LIGHTHOUSE_REPORT_GENERATION_STARTED: ({
    props,
    propertyIdentifier,
    createdBy
  }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Report generation started</span> for property :{' '}
      <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment by {createdBy}.
    </Text>
  ),
  LIGHTHOUSE_REPORT_GENERATION_FAILED: ({
    props,
    propertyIdentifier
  }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Report generation failed</span> for property :{' '}
      <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span> and spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.&nbsp;
    </Text>
  ),
  SYMLINK_CREATED: ({ props, createdBy }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Symlink created successfully for</span> spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment by {createdBy}.
    </Text>
  ),
  SYMLINK_CREATION_FAILED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Symlink creation failed for</span> spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment.&nbsp;
    </Text>
  ),
  SYMLINK_CREATION_SCHEDULED: ({ props, createdBy }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Symlink creation is scheduled for</span> spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment by {createdBy}.
    </Text>
  ),
  SYMLINK_DELETED: ({ props, createdBy }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Symlink deleted successfully for</span> spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment by {createdBy}.
    </Text>
  ),
  VIRTUAL_PATH_CREATION_FAILED: ({ props, createdBy }: TWebPropActivityStream): JSX.Element => (
    <Text className="activityStream">
      <span style={{ fontWeight: '600' }}>Virtual path creation failed for</span> spa :{' '}
      <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
      <span style={{ fontWeight: '600' }}>{props.env} </span> environment, initiated by {createdBy}.
    </Text>
  ),
  VIRTUAL_PATH_CREATED: ({ props, createdBy, message }: TWebPropActivityStream): JSX.Element => {
    const pathValue = message.match(/ - (.+?)\s/)?.[1]; // Extracting the path value after ' - '
    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}>Virtual path : {pathValue} created successfully</span>{' '}
        for spa: <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env}</span> environment, initiated by {createdBy}.{' '}
        <br />
      </Text>
    );
  },

  VIRTUAL_PATH_DELETION_FAILED: ({
    props,
    createdBy,
    message
  }: TWebPropActivityStream): JSX.Element => {
    const pathValue = message.match(/ - (.+?)\s/)?.[1]; // Extracting the path value after ' - '
    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}>Virtual path : {pathValue} deletion failed for</span>{' '}
        spa : <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env} </span> environment, initiated by {createdBy}
        .
      </Text>
    );
  },
  VIRTUAL_PATH_DELETED: ({ props, createdBy, message }: TWebPropActivityStream): JSX.Element => {
    const pathValue = message.match(/ - (.+?)\s/)?.[1]; // Extracting the path value after ' - '
    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}>Virtual path : {pathValue} deleted successfully</span>{' '}
        for spa: <span style={{ fontWeight: '600' }}>{props.applicationIdentifier}</span> for{' '}
        <span style={{ fontWeight: '600' }}>{props.env}</span> environment, initiated by {createdBy}.{' '}
        <br />
      </Text>
    );
  },
  CMDB_UPDATED: ({ props, propertyIdentifier, createdBy }: TWebPropActivityStream): JSX.Element => {
    const { applicationIdentifier } = props;
    const isApplicationLevel = applicationIdentifier !== 'NA';
    return (
      <Text className="activityStream">
        <span style={{ fontWeight: '600' }}>CMDB code for</span>&nbsp;
        {isApplicationLevel ? (
          <>
            spa: <span style={{ fontWeight: '600' }}>{applicationIdentifier}</span>&nbsp;
          </>
        ) : (
          <>
            property: <span style={{ fontWeight: '600' }}>{propertyIdentifier}</span>&nbsp;
          </>
        )}
        has been successfully updated by {createdBy}
      </Text>
    );
  }
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
        data?.pages?.map((page) =>
          page.map((activity: TWebPropActivityStream) => {
            const modifiedActivity = { ...activity, isGlobal };
            return (
              <Grid key={activity._id} hasGutter className="pf-u-mb-sm">
                <GridItem span={2}>
                  <div>
                    <p
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
                  activity.action.includes('DELETED') ||
                  activity.action.includes('UNAVAILABLE') ? (
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
