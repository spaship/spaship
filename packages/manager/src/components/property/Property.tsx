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
  onSelect: (conf: IConfig) => void;
  onRemove: (conf: IConfig) => void;
}
export default (props: IProps) => {
  const { config, selectedName, onSelect, onRemove } = props;
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const environments = config.environments;
  const footer = config.isPreset ? "Preset" : "Customize";

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
    <Card isFlat isHoverable isSelected={config.name === selectedName} isSelectable>
      <CardHeader>
        {renderCardActions()}
        <CardTitle onClick={onClick}>
          <ScreenIcon /> {config.name}
        </CardTitle>
      </CardHeader>

      <CardBody onClick={onClick}>
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
