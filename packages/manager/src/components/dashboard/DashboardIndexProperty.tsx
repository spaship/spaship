import { useState } from "react";
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
import { InfoCircleIcon, ScreenIcon } from "@patternfly/react-icons";
import { IConfig } from "../../config";

interface IProps {
  config?: any;
  selectedName?: string;
  onSelect: (conf: any) => void;
}
export default (props: IProps) => {
  const { config, selectedName, onSelect } = props;
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const onClick = () => {
    onSelect(config.spaName);
  };

  const renderCardActions = () => {
      return (
        <CardActions>
        
        </CardActions>
      );
  };


  const getRandomColor = () => {
    const colors = ["blue" , "cyan" , "green" , "orange" , "purple" , "red" , "grey" ]
    const index = Math.floor(Math.random() * (6 - 0 + 1)) + 0;
    return 'red';
  }

  
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