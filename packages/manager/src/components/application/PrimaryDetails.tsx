import {
  Card,
  CardHeader,
  CardBody,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextListItemVariants,
} from "@patternfly/react-core";
import { IApplication } from "../../models/Application";
import Spinner from "../general/Spinner";

interface IProps {
  application?: IApplication;
}
export default (props: IProps) => {
  const { application } = props;

  const renderBody = () => {
    if (!application) {
      return <Spinner />;
    }
    return (
      <TextContent>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>Name:</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{application?.name}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>Path:</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{application?.path}</TextListItem>
        </TextList>
      </TextContent>
    );
  };
  return (
    <Card isHoverable>
      <CardHeader>
        <TextContent>
          <Text component="h3">Primary Details</Text>
        </TextContent>
      </CardHeader>
      <CardBody>{renderBody()}</CardBody>
    </Card>
  );
};
