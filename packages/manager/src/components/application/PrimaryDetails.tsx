import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextListItemVariants
} from "@patternfly/react-core";
import { IApplication } from "../../models/Application";

interface IProps {
  application?: IApplication;
}
export default (props: IProps) => {
  // const { application } = props;
  return (
    <Card isHoverable>
      <CardHeader>
        <TextContent>
          <Text component="h3">Primary Details</Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <TextContent>
          <TextList component={TextListVariants.dl}>
            <TextListItem component={TextListItemVariants.dt}>Owner</TextListItem>
            <TextListItem component={TextListItemVariants.dd}>Kun Yan</TextListItem>
            <TextListItem component={TextListItemVariants.dt}>Source:</TextListItem>
            <TextListItem component={TextListItemVariants.dd}>https://github.com/spaship/spaship.git</TextListItem>
            <TextListItem component={TextListItemVariants.dt}>Latest version:</TextListItem>
            <TextListItem component={TextListItemVariants.dd}>1.3.2</TextListItem>
          </TextList>
        </TextContent>
      </CardBody>
    </Card>
  );
};
