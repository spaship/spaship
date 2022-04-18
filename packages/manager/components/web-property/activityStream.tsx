import {
  Label, 
  List, 
  ProgressStep, 
  ProgressStepper, 
  Text, 
  TextContent, 
  TextVariants
} from "@patternfly/react-core";
import { FunctionComponent } from "react";
import styled from 'styled-components';
import { ActivityProps, Properties } from "../models/props";

const DivStyle = styled.div`
  height: fit-content;
  width: 60vw;
  padding-bottom: 1rem;
  border: 1px solid var(--spaship-global--Color--light-gray);
  opacity: 1;
`;

const ActivityStream: FunctionComponent<Properties>  = ({ webprop }: Properties) => {
  return (
    <>
      <TextContent>
        <Text component={TextVariants.h1}>Activity Stream</Text>
      </TextContent><br />
      <DivStyle >
        <div >
          <List>
          <ProgressStepper isVertical>
            {webprop?.map((activity: ActivityProps) => {
              // This should be changed to more activities in the future.
              const variant = activity.code === "WEBSITE_CREATE" ? "success" : "danger";
              return <ProgressStep
                // id={activity.id}
                key={activity.id}
                variant={variant}
                // Description does not support elements yet. Hence they are rendered as text. 
                description={
                <TextContent>
                  <Text component={TextVariants.small}>
                    <Label color="green"> {activity.spaName}</Label> has been deployed over <Label color="green"> {activity.propertyName}</Label> on {activity.envs}<br />
                  </Text>
                </TextContent> as unknown as string}>
                <TextContent>
                  <Text component={TextVariants.small}>
                    {activity.createdAt}
                  </Text>
                </TextContent>
                
              </ProgressStep>
            })}
          </ProgressStepper>
          </List>
        </div>
      </DivStyle>
    </>
  );
};

export default ActivityStream;
