/* eslint-disable no-underscore-dangle */
import { useFormatDate } from '@app/hooks';
import { useGetWebPropActivityStream } from '@app/services/analytics';
import { TWebPropActivityStream } from '@app/services/analytics/types';
import { toPascalCase } from '@app/utils/toPascalConvert';
import {
  Label,
  ProgressStep,
  ProgressStepper,
  Skeleton,
  Spinner,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import {
  CheckIcon,
  ClusterIcon,
  CubeIcon,
  CubesIcon,
  ExclamationCircleIcon,
  OutlinedClockIcon,
  SyncAltIcon,
  TimesIcon,
  TrashIcon,
  UserIcon
} from '@patternfly/react-icons';
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

const activities = {
  APPLICATION_DEPLOYED: ({
    props,
    message,
    propertyIdentifier,
    isGlobal
  }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      Deployment{' '}
      <Label color="blue" icon={<CheckIcon />} variant="outline" isCompact>
        completed
      </Label>{' '}
      for{' '}
      {isGlobal ? (
        <>
          <Label color="blue" icon={<CubesIcon />} variant="outline" isCompact>
            <Link
              href={{
                pathname: '/properties/[propertyIdentifier]',
                query: { propertyIdentifier }
              }}
            >
              {propertyIdentifier}
            </Link>
          </Label>
          {' -> '}
        </>
      ) : (
        ''
      )}
      <Label icon={<CubeIcon />} color="blue" isCompact>
        <Link
          href={{
            pathname: '/properties/[propertyIdentifier]/[spaProperty]',
            query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
          }}
        >
          {props.applicationIdentifier}
        </Link>
      </Label>{' '}
      in{' '}
      <Label icon={<ClusterIcon />} color="blue" isCompact>
        {props.env}
      </Label>{' '}
      env with{' '}
      <Label icon={<OutlinedClockIcon />} color="blue" isCompact>
        {message}.
      </Label>
    </Text>
  ),
  PROPERTY_CREATED: ({ propertyIdentifier }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<CubesIcon />} color="blue" isCompact>
        {propertyIdentifier}
      </Label>{' '}
      has been created.{' '}
    </Text>
  ),
  ENV_CREATED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<ClusterIcon />} color="blue" isCompact>
        {props.env}
      </Label>{' '}
      environment has been created.{' '}
    </Text>
  ),
  APPLICATION_DEPLOYMENT_STARTED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      Deployment{' '}
      <Label color="blue" icon={<OutlinedClockIcon />} variant="outline">
        started
      </Label>{' '}
      for
      <Label icon={<CubeIcon />} color="blue" isCompact>
        {props.applicationIdentifier}
      </Label>{' '}
      App in the{' '}
      <Label icon={<ClusterIcon />} color="blue" isCompact>
        {props.env}
      </Label>{' '}
      env.
    </Text>
  ),
  APIKEY_CREATED: ({ props, propertyIdentifier }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      API key has been
      <Label color="blue" icon={<CheckIcon />} variant="outline">
        created
      </Label>{' '}
      for{' '}
      <Label icon={<CubeIcon />} color="blue" isCompact>
        {propertyIdentifier}
      </Label>{' '}
      with scope{' '}
      <Label icon={<OutlinedClockIcon />} color="blue" isCompact>
        {props.env}.{' '}
      </Label>
    </Text>
  ),
  APIKEY_DELETED: ({ props, propertyIdentifier }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      API key has been{' '}
      <Label color="red" icon={<TimesIcon />} variant="outline">
        deleted{' '}
      </Label>{' '}
      for{' '}
      <Label icon={<CubeIcon />} color="blue" isCompact>
        {propertyIdentifier}
      </Label>{' '}
      with scope{' '}
      <Label icon={<OutlinedClockIcon />} color="blue" isCompact>
        {props.env}.{' '}
      </Label>
    </Text>
  ),
  ENV_SYNCED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<SyncAltIcon />} color="blue" isCompact>
        Sync{' '}
      </Label>
      completed for{' '}
      <Label icon={<ClusterIcon />} color="blue" isCompact>
        {props.env}
      </Label>{' '}
      environment{' '}
    </Text>
  ),
  APPLICATION_DELETED: ({ props, message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<CubeIcon />} color="blue" isCompact>
        {props.applicationIdentifier}
      </Label>{' '}
      has been
      <Label color="red" icon={<TimesIcon />} variant="outline">
        deleted
      </Label>{' '}
      for
      <Label icon={<ClusterIcon />} color="blue" isCompact>
        {props.env}
      </Label>{' '}
      Misc:{' '}
      <Label icon={<OutlinedClockIcon />} color="blue" isCompact>
        {message}.
      </Label>
    </Text>
  ),
  APPLICATION_DEPLOYMENT_FAILED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<CubeIcon />} color="blue" isCompact>
        {props.applicationIdentifier}
      </Label>{' '}
      has{' '}
      <Label color="red" icon={<ExclamationCircleIcon />} variant="outline">
        failed to deploy{' '}
      </Label>{' '}
      in{' '}
      <Label icon={<OutlinedClockIcon />} color="blue" isCompact>
        {props.env}.{' '}
      </Label>
    </Text>
  ),
  ENV_DELETED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<ClusterIcon />} color="blue" isCompact>
        {props.env}
      </Label>{' '}
      environment has been{' '}
      <Label color="red" icon={<TimesIcon />} variant="outline">
        {' '}
        deleted{' '}
      </Label>
    </Text>
  ),
  PERMISSION_CREATED: ({ message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<CubeIcon />} color="blue" isCompact>
        {toPascalCase(message.split(' ')[0]).replace('_', ' ')}
      </Label>{' '}
      access{' '}
      <Label color="green" icon={<CheckIcon />} variant="outline" isCompact>
        {message.split(' ')[2]}
      </Label>{' '}
      for{' '}
      <Label color="blue" icon={<UserIcon />} isCompact>
        {message.split(' ')[4]}
      </Label>{' '}
    </Text>
  ),
  PERMISSION_DELETED: ({ message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<CubeIcon />} color="blue" isCompact>
        {toPascalCase(message?.split(' ')[0]).replace('_', ' ')}
      </Label>{' '}
      access{' '}
      <Label color="red" icon={<TrashIcon />} variant="outline" isCompact>
        {message?.split(' ')[2]}
      </Label>{' '}
      for{' '}
      <Label color="blue" icon={<UserIcon />} isCompact>
        {message?.split(' ')[4]}
      </Label>{' '}
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
      <ProgressStepper isVertical>
        {isLoading && <Spinner isSVG aria-label="Activity stream loading" />}
        {isSuccess &&
          data.pages?.map((page) =>
            page.map((activity: TWebPropActivityStream) => {
              const modifiedActivity = { ...activity, isGlobal };
              return (
                <ProgressStep
                  id={activity._id}
                  titleId={activity._id}
                  key={activity._id}
                  variant="success"
                  description={formatDate(activity.createdAt, 'MMM DD YY, hh:mm a')}
                >
                  <TextContent className="pf-u-mb-sm">
                    <DeploymentKind activity={modifiedActivity} />
                  </TextContent>
                </ProgressStep>
              );
            })
          )}
      </ProgressStepper>
      {isFetchingNextPage && (
        <ProgressStepper isVertical>
          {Array.from(Array(5).keys()).map((key) => (
            <ProgressStep
              key={key}
              variant="success"
              description={
                <Skeleton width="15%" fontSize="md" screenreaderText="Loading activity stream" />
              }
            >
              <TextContent className="pf-u-mb-sm">
                <Skeleton width="60%" fontSize="md" screenreaderText="Loading activity stream" />
              </TextContent>
            </ProgressStep>
          ))}
        </ProgressStepper>
      )}
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
