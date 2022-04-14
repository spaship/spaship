import {
  Label, List,
  ListItem, Text, TextContent, TextVariants
} from "@patternfly/react-core";
import { FunctionComponent } from "react";
import styled from 'styled-components';
import { ActivityProps, Properties } from "../models/props";

const DivStyle = styled.div`
  height: 31vw;
  width: 60vw;
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
          <br />
          <List>
            {webprop.map((activity: ActivityProps) => (
              <ListItem key={activity.id}>
                <TextContent>
                  <Text component={TextVariants.small}>
                    <Label color="green"> {activity.spaName}</Label> &nbsp; &nbsp; has been deployed over &nbsp;
                    <Label color="green"> {activity.propertyName}</Label> on {activity.envs} at {activity.createdAt}<br />
                  </Text>
                </TextContent>
              </ListItem>
            ))}
          </List>
        </div>
      </DivStyle>
    </>
  );
};

export default ActivityStream;
