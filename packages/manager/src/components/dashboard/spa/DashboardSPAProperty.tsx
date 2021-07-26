import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Text,
  TextVariants,
  Label,
  DropdownItem,
  CardHeader,
  CardActions,
  Dropdown,
  KebabToggle,
} from "@patternfly/react-core";
import { InfoCircleIcon, InfoCircleIconConfig, ScreenIcon } from "@patternfly/react-icons";
import { useState } from "react";

interface IProps {
  config?: any;
  selectedName?: string;
}
export default (props: IProps) => {
  const { config, selectedName } = props;
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const renderCardActions = () => {
    return (
      <CardActions>

      </CardActions>
    );
  };

  return (
    <Card isFlat isHoverable isSelected={selectedName === selectedName} isSelectable={true}>
      <CardHeader>
        {renderCardActions()}
        <CardTitle >
          <ScreenIcon /> {selectedName}
        </CardTitle>
      </CardHeader>

      <CardBody >
        {/* <Text component={TextVariants.h4}>Deployment Counts : {config.count}</Text> */}

        <Label icon={<InfoCircleIcon />} color="blue">Deployment Counts : &nbsp;  <Text component={TextVariants.h1}><b>{config.count}</b></Text>  </Label>

      </CardBody>
      <CardFooter >
        <Text component={TextVariants.small}>{ }</Text>
      </CardFooter>
    </Card>
  );
};