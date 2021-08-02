import {
  Card, CardActions, CardBody,
  CardFooter, CardHeader, CardTitle, Label, Text,
  TextVariants
} from "@patternfly/react-core";
import { InfoCircleIcon, ScreenIcon } from "@patternfly/react-icons";
import { useState } from "react";

interface IProps {
  config?: any;
  selectedName?: string;
  propertyName?: string;
  onSelect: (conf: any, propertyName: any) => void;
}
export default (props: IProps) => {
  const { config, selectedName, onSelect, propertyName } = props;
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const onClick = () => {
    onSelect(config.spaName, propertyName);
  };

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
        <CardTitle onClick={onClick}>
          <ScreenIcon /> {selectedName}
        </CardTitle>
      </CardHeader>
      <CardBody onClick={onClick}>
      {/* <Text component={TextVariants.h4}>Deployment Counts : {config.count}</Text> */}
      <Label icon={<InfoCircleIcon />} color="green">Deployment Counts : &nbsp;  <Text component={TextVariants.h1}><b>{config.count}</b></Text>  </Label>
      </CardBody>
      <CardFooter onClick={onClick}>
        <Text component={TextVariants.small}>{}</Text>
      </CardFooter>
    </Card>
  );
};