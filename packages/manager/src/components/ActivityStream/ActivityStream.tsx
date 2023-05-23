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
  BuildIcon,
  BundleIcon,
  CheckIcon,
  ClusterIcon,
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
    <Text component={TextVariants.small}>
      <Label color="green" icon={<CheckIcon />}>
        Deployment completed
      </Label>{' '}
      for{' '}
      {isGlobal ? (
        <>
          <Label color="green" icon={<CubesIcon />}>
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
      <Link
        href={{
          pathname: '/properties/[propertyIdentifier]/[spaProperty]',
          query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
        }}
      >
        <Label
          icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
          color="green"
        >
          {props.applicationIdentifier}
        </Label>
      </Link>{' '}
      in{' '}
      <Label icon={<ClusterIcon />} color="green">
        {props.env}
      </Label>{' '}
      env.
    </Text>
  ),

  APPLICATION_DEPLOYMENT_STARTED: ({ props, message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label color="blue" icon={<OutlinedClockIcon />}>
        Deployment started
      </Label>{' '}
      for{' '}
      <Label
        icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
        color="blue"
      >
        {props.applicationIdentifier}
      </Label>{' '}
      App in the{' '}
      <Label icon={<ClusterIcon />} color="blue">
        {props.env}
      </Label>{' '}
      env.
    </Text>
  ),
  APPLICATION_DEPLOYMENT_PROCESSING: ({ props, message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label color="grey" icon={<OutlinedClockIcon />}>
        Deployment processing
      </Label>{' '}
      for{' '}
      <Label
        icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
        color="grey"
      >
        {props.applicationIdentifier}
      </Label>{' '}
      App in the{' '}
      <Label icon={<ClusterIcon />} color="grey">
        {props.env}
      </Label>{' '}
      env.
    </Text>
  ),
  APPLICATION_DEPLOYMENT_FAILED: ({ props, message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label color="red" icon={<ExclamationCircleIcon />}>
        Deployment failed
      </Label>{' '}
      for{' '}
      <Label
        icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
        color="red"
      >
        {props.applicationIdentifier}
      </Label>{' '}
      App in the{' '}
      <Label icon={<ClusterIcon />} color="red">
        {props.env}
      </Label>{' '}
      env.{' '}
    </Text>
  ),

  APPLICATION_DEPLOYMENT_TIMEOUT: ({ props, message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label color="red" icon={<ExclamationCircleIcon />}>
        Deployment timeout
      </Label>{' '}
      for{' '}
      <Label
        icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
        color="red"
      >
        {props.applicationIdentifier}
      </Label>{' '}
      App in the{' '}
      <Label icon={<ClusterIcon />} color="red">
        {props.env}
      </Label>{' '}
      env.{' '}
    </Text>
  ),
  APPLICATION_BUILD_STARTED: ({ props, message, payload }: TWebPropActivityStream): JSX.Element => {
    const buildId = JSON.parse(payload).buildName;

    return (
      <Text component={TextVariants.small}>
        <Label color="blue" icon={<OutlinedClockIcon />}>
          Build started
        </Label>{' '}
        with{' '}
        <Label color="blue" variant="outline">
          ID : {buildId}
        </Label>{' '}
        for
        <Label
          icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
          color="blue"
        >
          {props.applicationIdentifier}
        </Label>{' '}
        App in the{' '}
        <Label icon={<ClusterIcon />} color="blue">
          {props.env}
        </Label>{' '}
        env.
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
      <Text component={TextVariants.small}>
        <Label color="green" icon={<CheckIcon />}>
          Build completed
        </Label>{' '}
        with{' '}
        <Label color="green" variant="outline">
          ID : {buildId}
        </Label>{' '}
        for{' '}
        <Link
          href={{
            pathname: '/properties/[propertyIdentifier]/[spaProperty]',
            query: { propertyIdentifier, spaProperty: props.applicationIdentifier }
          }}
        >
          <Label
            icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
            color="green"
          >
            {props.applicationIdentifier}
          </Label>
        </Link>{' '}
        in{' '}
        <Label icon={<ClusterIcon />} color="green">
          {props.env}
        </Label>{' '}
        env.
      </Text>
    );
  },
  APPLICATION_BUILD_FAILED: ({ props, message }: TWebPropActivityStream): JSX.Element => {
    const buildId = extractBuildIdFromMessage(message);
    return (
      <Text component={TextVariants.small}>
        <Label color="red" icon={<ExclamationCircleIcon />}>
          Build failed
        </Label>{' '}
        with{' '}
        <Label color="red" variant="outline">
          ID : {buildId}
        </Label>{' '}
        for{' '}
        <Label
          icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
          color="red"
        >
          {props.applicationIdentifier}
        </Label>{' '}
        App in the{' '}
        <Label icon={<ClusterIcon />} color="red">
          {props.env}
        </Label>{' '}
        env.{' '}
      </Text>
    );
  },
  APPLICATION_BUILD_TERMINATED: ({ props, message }: TWebPropActivityStream): JSX.Element => {
    const buildId = extractBuildIdFromMessage(message);

    return (
      <Text component={TextVariants.small}>
        <Label color="red" icon={<ExclamationCircleIcon />}>
          Build terminated
        </Label>{' '}
        with{' '}
        <Label color="red" variant="outline">
          ID : {buildId}
        </Label>{' '}
        for{' '}
        <Label
          icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
          color="red"
        >
          {props.applicationIdentifier}
        </Label>{' '}
        App in the{' '}
        <Label icon={<ClusterIcon />} color="red">
          {props.env}
        </Label>{' '}
        env.{' '}
      </Text>
    );
  },
  PROPERTY_CREATED: ({ propertyIdentifier }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<CubesIcon />} color="green">
        {propertyIdentifier}
      </Label>{' '}
      has been created.{' '}
    </Text>
  ),
  APIKEY_CREATED: ({ props, propertyIdentifier, message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      API key has been
      <Label color="green" icon={<CheckIcon />}>
        created
      </Label>{' '}
      for{' '}
      <Label
        icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
        color="green"
      >
        {propertyIdentifier}
      </Label>{' '}
      with scope{' '}
      <Label icon={<ClusterIcon />} color="green">
        {props.env}.{' '}
      </Label>
    </Text>
  ),
  APIKEY_DELETED: ({ props, propertyIdentifier, message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      API key has been{' '}
      <Label color="red" icon={<TimesIcon />}>
        deleted{' '}
      </Label>{' '}
      for{' '}
      <Label
        icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
        color="red"
      >
        {propertyIdentifier}
      </Label>{' '}
      with scope{' '}
      <Label icon={<ClusterIcon />} color="red">
        {props.env}.{' '}
      </Label>
    </Text>
  ),
  ENV_SYNCED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<SyncAltIcon />} color="green">
        Sync{' '}
      </Label>
      completed for{' '}
      <Label icon={<ClusterIcon />} color="green">
        {props.env}
      </Label>{' '}
      environment{' '}
    </Text>
  ),
  APPLICATION_DELETED: ({ props, message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label
        icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
        color="red"
      >
        {props.applicationIdentifier}
      </Label>{' '}
      has been
      <Label color="red" icon={<TimesIcon />}>
        deleted
      </Label>{' '}
      for
      <Label icon={<ClusterIcon />} color="red">
        {props.env}
      </Label>{' '}
      Misc:{' '}
      <Label icon={<OutlinedClockIcon />} color="red">
        {message}.
      </Label>
    </Text>
  ),
  ENV_CREATED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<ClusterIcon />} color="green">
        {props.env}
      </Label>{' '}
      environment has been created.{' '}
    </Text>
  ),
  ENV_DELETED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<ClusterIcon />} color="red">
        {props.env}
      </Label>{' '}
      environment has been{' '}
      <Label color="red" icon={<TimesIcon />}>
        {' '}
        deleted{' '}
      </Label>
    </Text>
  ),
  PERMISSION_CREATED: ({ message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label
        icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
        color="green"
      >
        {toPascalCase(message.split(' ')[0]).replace('_', ' ')}
      </Label>{' '}
      access{' '}
      <Label color="green" icon={<CheckIcon />}>
        {message.split(' ')[2]}
      </Label>{' '}
      for{' '}
      <Label color="green" icon={<UserIcon />}>
        {message.split(' ')[4]}
      </Label>{' '}
    </Text>
  ),
  PERMISSION_DELETED: ({ message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label
        icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
        color="red"
      >
        {toPascalCase(message?.split(' ')[0]).replace('_', ' ')}
      </Label>{' '}
      access{' '}
      <Label color="red" icon={<TrashIcon />}>
        {message?.split(' ')[2]}
      </Label>{' '}
      for{' '}
      <Label color="red" icon={<UserIcon />}>
        {message?.split(' ')[4]}
      </Label>{' '}
    </Text>
  ),
  APPLICATION_CONFIG_UPDATED: ({ props, message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      Application
      <Label color="green" icon={<CheckIcon />}>
        Configuration Updated
      </Label>{' '}
      for{' '}
      <Label
        icon={message.toLowerCase().includes('contain') ? <BuildIcon /> : <BundleIcon />}
        color="green"
      >
        {props.applicationIdentifier}
      </Label>
      in{' '}
      <Label icon={<ClusterIcon />} color="green">
        {props.env}
      </Label>{' '}
      env.
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
              const startedCondition = activity.action.includes('STARTED') ? 'info' : 'success';
              return (
                <ProgressStep
                  id={activity._id}
                  titleId={activity._id}
                  key={activity._id}
                  variant={
                    activity.action.includes('FAIL') ||
                    activity.action.includes('TERMINATED') ||
                    activity.action.includes('TIMEOUT') ||
                    activity.action.includes('DELETED')
                      ? 'danger'
                      : startedCondition
                  }
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
