import { useState } from "react";
import { InputGroup, InputGroupText, TextInput } from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

interface IProps {
  onChange: (value: string) => void;
}

export default (props: IProps) => {
  const [value, setValue] = useState("");

  function handleFilterChange(value: string) {
    setValue(value);
    props.onChange && props.onChange(value);
  }

  return (
    <InputGroup>
      <TextInput
        id="search-application-text"
        placeholder="Search"
        value={value}
        type="text"
        onChange={handleFilterChange}
        aria-label="Application Name filter"
      />
      <InputGroupText component="label">
        <SearchIcon />
      </InputGroupText>
    </InputGroup>
  );
};
