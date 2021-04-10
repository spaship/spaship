import { Bullseye, Spinner, SpinnerProps } from "@patternfly/react-core";

export default (props: SpinnerProps) => {
  return (
    <Bullseye>
      <Spinner {...props} />
    </Bullseye>
  );
};
