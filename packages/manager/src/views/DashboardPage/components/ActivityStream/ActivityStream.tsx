// export const ActivityStream = () => (
// 	<div>Activity Stream</div>
// );
import { useFormatDate } from '@app/hooks';
import { ReactNode } from 'react';
import { useGetDashboardActivityStream } from '@app/services/analytics';
import { TDashboardActivityStream } from '@app/services/analytics/types';
import { Card } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
	CheckIcon,
	ClusterIcon,
	CubeIcon,
	CubesIcon,
	ExclamationCircleIcon,
	OutlinedClockIcon,
	SyncAltIcon,
	TimesIcon,
	ResourcesEmptyIcon,
  } from '@patternfly/react-icons';
import {
	Label,
	ProgressStep,
	ProgressStepper,
	Skeleton,
	Spinner,
	Text,
	TextContent,
	TextVariants,
	Button,
	ButtonVariant
  } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

type Props = {
	propertyIdentifier: string;
	title?: ReactNode;
	subtitle?: ReactNode;
	children?: ReactNode;
	footer?: ReactNode;
	isSelected?: boolean;
	applicationIdentifier?: string;
  };
  
  type DeploymentKindProps = {
	activity: TDashboardActivityStream;
  };

  const activities = {
	APPLICATION_DEPLOYED: ({ props, message }: TDashboardActivityStream): JSX.Element => (
	  <Text component={TextVariants.small}>
		Deployment{' '}
		<Label color="blue" icon={<CheckIcon />} variant="outline">
		  completed
		</Label>{'  '}
		 for
		<Label icon={<CubeIcon />} color="blue" isCompact>
		  {props.applicationIdentifier}
		</Label>{'  '}
		in
		<Label icon={<ClusterIcon />} color="blue" isCompact>
		  {props.env}
		</Label>{'  '}
		env with
		<Label icon={<OutlinedClockIcon />} color="blue" isCompact>
		  {message}.
		</Label>
	  </Text>
	),
	APPLICATION_DEPLOYMENT_FAILED: ({ props }: TDashboardActivityStream): JSX.Element => (
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
  useGetDashboardActivityStream(propertyIdentifier, applicationIdentifier);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);
  const formatDate = useFormatDate();
  // const refresh = () => {
	// window.location.reload();  
	// console.log("page refreshed")
  // };
  
  return (
    <>
	<h2 style={{marginTop:'20px',marginBottom:'10px',marginLeft:'40px'}}>Activity Stream</h2>
	<Card
    isSelectable
    isFullHeight
    style={{marginBottom:'10px',marginRight:'30px', marginTop:'10px',marginLeft:'40px',height: '650px', overflow: 'auto',scrollbarWidth:'none'}}
    isRounded
    className={css('pf-u-px-sm rounded-md transition hover:shadow-sm')}
  >
	<div style={{marginTop:'10px',marginLeft:'10px'}} >
		<div style={{marginRight:'2px',marginLeft:'575px'}}>
		{/* <Button
          aria-label="SyncAltIcon "
          icon={<SyncAltIcon />}
        //   href={env.PUBLIC_GITHUB_URL}
		    variant={ButtonVariant.tertiary}
                  style={{ color: '#0047AB',backgroundColor:'#E5E4E2',outline:'none'}}
          target="_blank"
		  onClick={refresh}
          component="a"
        >
        </Button> */}
		</div>
      <ProgressStepper isVertical>
        {isLoading && <Spinner isSVG aria-label="Activity stream loading" />}
        {isSuccess &&
          data.pages?.map((page) =>
            page.map((activity: TDashboardActivityStream) => (
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
	  </div>
	  </Card>
    </>
  );
};

ActivityStream.defaultProps = {
  applicationIdentifier: ''
};
