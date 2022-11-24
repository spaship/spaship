/* eslint-disable no-underscore-dangle */
import { useFormatDate } from '@app/hooks';
import { useGetWebPropActivityStream } from '@app/services/analytics';
import { TWebPropActivityStream } from '@app/services/analytics/types';
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
  TimesIcon
} from '@patternfly/react-icons';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

type Props = {
  propertyIdentifier: string;
  applicationIdentifier?: string;
};

type DeploymentKindProps = {
  activity: TWebPropActivityStream;
};

const activities = {
  APPLICATION_DEPLOYED: ({ props, message }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      Deployment{' '}
      <Label color="blue" icon={<CheckIcon />} variant="outline">
        completed
      </Label>{' '}
      for
      <Label icon={<CubeIcon />} color="blue" isCompact>
        {props.applicationIdentifier}
      </Label>{' '}
      in
      <Label icon={<ClusterIcon />} color="blue" isCompact>
        {props.env}
      </Label>{' '}
      env with
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
      has been created.
    </Text>
  ),
  ENV_CREATED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<ClusterIcon />} color="blue" isCompact>
        {props.env}
      </Label>{' '}
      environment has been created.
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
      for
      <Label icon={<CubeIcon />} color="blue" isCompact>
        {propertyIdentifier}
      </Label>{' '}
      with scope
      <Label icon={<OutlinedClockIcon />} color="blue" isCompact>
        {props.env}.
      </Label>
    </Text>
  ),
  APIKEY_DELETED: ({ props, propertyIdentifier }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      API key has been
      <Label color="red" icon={<TimesIcon />} variant="outline">
        deleted
      </Label>{' '}
      for
      <Label icon={<CubeIcon />} color="blue" isCompact>
        {propertyIdentifier}
      </Label>{' '}
      with scope
      <Label icon={<OutlinedClockIcon />} color="blue" isCompact>
        {props.env}.
      </Label>
    </Text>
  ),
  ENV_SYNCED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<SyncAltIcon />} color="blue" isCompact>
        Sync
      </Label>
      completed for
      <Label icon={<ClusterIcon />} color="blue" isCompact>
        {props.env}
      </Label>{' '}
      environment
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
      Misc:
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
      has
      <Label color="red" icon={<ExclamationCircleIcon />} variant="outline">
        failed to deploy
      </Label>{' '}
      in
      <Label icon={<OutlinedClockIcon />} color="blue" isCompact>
        {props.env}.
      </Label>
    </Text>
  ),
  ENV_DELETED: ({ props }: TWebPropActivityStream): JSX.Element => (
    <Text component={TextVariants.small}>
      <Label icon={<ClusterIcon />} color="blue" isCompact>
        {props.env}
      </Label>{' '}
      environment has been
      <Label color="red" icon={<TimesIcon />} variant="outline">
        deleted
      </Label>
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
  propertyIdentifier,
  applicationIdentifier
}: Props): JSX.Element => {
  const { isLoading, isSuccess, data, isFetchingNextPage, fetchNextPage } =
    useGetWebPropActivityStream(propertyIdentifier, applicationIdentifier);
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
            page.map((activity: TWebPropActivityStream) => (
              <ProgressStep
                id={activity._id}
                titleId={activity._id}
                key={activity._id}
                variant="success"
                // Description does not support elements yet. Hence they are rendered as text.
                description={formatDate(activity.createdAt, 'MMM DD YY, hh:mm a')}
              >
                <TextContent className="pf-u-mb-sm">
                  <DeploymentKind activity={activity} />
                </TextContent>
              </ProgressStep>
            ))
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
  applicationIdentifier: ''
};
