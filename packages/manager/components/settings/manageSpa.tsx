import {
  Card,
  CardTitle,
  Switch
} from "@patternfly/react-core";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@patternfly/react-table";
import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { Properties, SPAProps } from "../models/props";

const StyledCard = styled(Card)`
  margin-bottom: 2rem;
`;

const ManageSpa: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const [switchState, setSwitchState] = useState(true);
  const handleChange = () => {
    // TODO: implement logic to toggle spa
    setSwitchState(!switchState);
  };
  return (
    <>
      <StyledCard>
        <CardTitle>Manage SPAs</CardTitle>
        <TableComposable>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Path</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {webprop?.map((spa: SPAProps) => (
              <Tr key={spa.spaName}>
                <Td dataLabel={spa.spaName}>{spa.spaName}</Td>
                <Td dataLabel={spa.propertyName}>/{spa.spaName}</Td>
                <Td dataLabel={spa.spaName}>
                  <Switch
                    id={spa.spaName}
                    aria-label="spaship-switch-area"
                    isChecked={switchState}
                    onChange={handleChange}
                    isDisabled
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      </StyledCard>
    </>
  );
};

export default ManageSpa;
