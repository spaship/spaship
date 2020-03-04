import React from "react";
import PrimaryDetails from "./PrimaryDetails";
import EnvironmentDetails from "./EnvironmentDetails";
import { Stack, StackItem } from "@patternfly/react-core";

export default () => {
  return (
    <Stack gutter="md">
      <StackItem>
        <PrimaryDetails />
      </StackItem>
      <StackItem>
        <EnvironmentDetails />
      </StackItem>
    </Stack>
  );
};
