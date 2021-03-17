import { IApplication } from "../../models/Application";
import { IEnvironment } from "../../config";
import { Label } from "@patternfly/react-core";

interface IProps {
  environment: IEnvironment;
  application: IApplication;
}

export default (props: IProps) => {
  const { application, environment } = props;
  if (application && application.environments) {
    const match = application.environments.find((appEnv) => appEnv.name === environment.name);
    if (match) {
      return match.ref ? <Label title={match.timestamp}>{match.ref}</Label> : <span>No Ref</span>;
    }
  }
  return <span>Ready to deploy</span>;
};
