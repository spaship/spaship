import { TextContent, Text, Card, CardHeader, CardBody } from "@patternfly/react-core";
import ApplicationEnvironmentTable from "./ApplicationEnvironmentTable";
import { IApplication } from "../../models/Application";

interface IProps {
  application?: IApplication;
}
export default (props: IProps) => {
  const { application } = props;

  const renderBody = () => {
    if (!application) {
      return <div>Loading...</div>;
    }
    return <ApplicationEnvironmentTable application={application} />;
  };
  return (
    <Card isHoverable>
      <CardHeader>
        <TextContent>
          <Text component="h3">Environment Details</Text>
        </TextContent>
      </CardHeader>
      <CardBody>{renderBody()}</CardBody>
    </Card>
  );
};
