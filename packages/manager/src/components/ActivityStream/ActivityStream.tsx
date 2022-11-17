/* eslint-disable no-underscore-dangle */
import { useFormatDate } from '@app/hooks';
import { useGetWebPropActivityStream } from '@app/services/analytics';
import { TWebPropActivityStream } from '@app/services/analytics/types';
import {
  Label,
  ProgressStep,
  ProgressStepper,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import {
  CheckIcon,
  ClusterIcon,
  CubeIcon,
  CubesIcon,
  OutlinedClockIcon,
  TimesIcon
} from '@patternfly/react-icons';

type Props = {
  propertyIdentifier: string;
  applicationIdentifier?: string;
};

type DeploymentKindProps = {
  activity: TWebPropActivityStream;
};
const DeploymentKind = ({ activity }: DeploymentKindProps) => {
  if (activity.action === 'APPLICATION_DEPLOYED') {
    return (
      <Text component={TextVariants.small}>
        Deployment{' '}
        <Label color="blue" icon={<CheckIcon />} variant="outline">
          completed
        </Label>{' '}
        for
        <Label icon={<CubeIcon />} color="blue" isCompact>
          {activity.props.applicationIdentifier}
        </Label>{' '}
        in
        <Label icon={<ClusterIcon />} color="blue" isCompact>
          {activity.props.env}
        </Label>{' '}
        env with
        <Label icon={<OutlinedClockIcon />} color="blue" isCompact>
          {activity.message}.
        </Label>
      </Text>
    );
  }
  if (activity.action === 'PROPERTY_CREATED') {
    return (
      <Text component={TextVariants.small}>
        <Label icon={<CubesIcon />} color="blue" isCompact>
          {activity.propertyIdentifier}
        </Label>{' '}
        has been created.
      </Text>
    );
  }
  if (activity.action === 'ENV_CREATED') {
    return (
      <Text component={TextVariants.small}>
        <Label icon={<ClusterIcon />} color="blue" isCompact>
          {activity.props.env}
        </Label>{' '}
        environment has been created.
      </Text>
    );
  }
  if (activity.action === 'APPLICATION_DEPLOYMENT_STARTED') {
    return (
      <Text component={TextVariants.small}>
        Deployment{' '}
        <Label color="blue" icon={<OutlinedClockIcon />} variant="outline">
          started
        </Label>{' '}
        for
        <Label icon={<CubeIcon />} color="blue" isCompact>
          {activity.props.applicationIdentifier}
        </Label>{' '}
        App in the{' '}
        <Label icon={<ClusterIcon />} color="blue" isCompact>
          {activity.props.env}
        </Label>{' '}
        env.
      </Text>
    );
  }
  if (activity.action === 'APIKEY_CREATED') {
    return (
      <Text component={TextVariants.small}>
        API key has been
        <Label color="blue" icon={<CheckIcon />} variant="outline">
          created
        </Label>{' '}
        for
        <Label icon={<CubeIcon />} color="blue" isCompact>
          {activity.propertyIdentifier}
        </Label>{' '}
        with scope
        <Label icon={<OutlinedClockIcon />} color="blue" isCompact>
          {activity.props.env}.
        </Label>
      </Text>
    );
  }
  if (activity.action === 'APIKEY_DELETED') {
    return (
      <Text component={TextVariants.small}>
        API key has been
        <Label color="red" icon={<TimesIcon />} variant="outline">
          deleted
        </Label>{' '}
        for
        <Label icon={<CubeIcon />} color="blue" isCompact>
          {activity.propertyIdentifier}
        </Label>{' '}
        with scope
        <Label icon={<OutlinedClockIcon />} color="blue" isCompact>
          {activity.props.env}.
        </Label>
      </Text>
    );
  }
  return <Text component={TextVariants.small}>Activity completed</Text>;
};

export const ActivityStream = ({
  propertyIdentifier,
  applicationIdentifier
}: Props): JSX.Element => {
  const activityStream = useGetWebPropActivityStream(propertyIdentifier, applicationIdentifier);
  const formatDate = useFormatDate();
  // TODO: This component should have infinite scroll pagination
  return (
    <ProgressStepper isVertical>
      {activityStream?.data?.map((activity) => (
        <ProgressStep
          id={activity._id}
          titleId={activity._id}
          key={activity._id}
          variant="success"
          // Description does not support elements yet. Hence they are rendered as text.
          description={formatDate(activity.createdAt, 'MMM DD, hh:mm a')}
        >
          <TextContent className="pf-u-mb-sm">
            <DeploymentKind activity={activity} />
          </TextContent>
        </ProgressStep>
      ))}
    </ProgressStepper>
  );
};

ActivityStream.defaultProps = {
  applicationIdentifier: ''
};
