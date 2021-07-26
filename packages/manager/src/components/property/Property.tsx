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
import { ScreenIcon } from "@patternfly/react-icons";
import { IConfig } from "../../config";

interface IProps {
  config: IConfig;
  selectedName?: string;
  event: any[];
  onSelect: (conf: IConfig) => void;
  onRemove: (conf: IConfig) => void;
}
export default (props: IProps) => {

  const { config, selectedName, onSelect, onRemove, event } = props;
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const environments = config.environments;
  const footer = config.isPreset ? "Preset" : "Customize";

  var map = new Map();
  event.forEach((item) => {
    map.set(item.propertyName, item.count);
  });

  const onClick = () => {
    onSelect(config);
  };

  const handleRemove = () => {
    onRemove(config);
  };
  const onToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const dropdownItems = [
    <DropdownItem key="remove-config" onClick={handleRemove}>
      Remove
    </DropdownItem>,
  ];

  const renderCardActions = () => {
    if (!config.isPreset) {
      return (
        <CardActions>
          <Dropdown
            toggle={<KebabToggle onToggle={onToggle} />}
            isOpen={isDropdownOpen}
            isPlain
            dropdownItems={dropdownItems}
          />
        </CardActions>
      );
    }
  };
  return (
    <Card isFlat isHoverable isSelected={config.name === selectedName} isSelectable={true}>
      <CardHeader>
        {renderCardActions()}
        <CardTitle onClick={onClick}>
          <ScreenIcon /> {selectedName}
        </CardTitle>
      </CardHeader>

      <CardBody onClick={onClick}>



        <Text component={TextVariants.h4}>Deployment Count : <b>{map.get(selectedName)}</b></Text>

        <br></br>
        {environments?.map((env) => (
          <Label variant="outline" key={`${config.name}-env-${env.name}`}>
            {env.name}
          </Label>
        ))}

      </CardBody>


      <CardFooter onClick={onClick}>
        <Text component={TextVariants.small}>{footer}</Text>
      </CardFooter>
    </Card>
  );
};
