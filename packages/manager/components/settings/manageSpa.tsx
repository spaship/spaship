import {
  Switch
} from "@patternfly/react-core";
import {
  Caption, TableComposable, Tbody,
  Td, Tr
} from "@patternfly/react-table";
import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { Properties, SPAProps } from "../models/props";

const ListBox = styled.div`
  width: 1041px;
  height: fit-content;
  background: var(---ffffff) 0% 0% no-repeat padding-box;
  border: 1px solid #D2D2D2;
  border-radius: 8px;
  opacity: 1;
`;

const ManageSpa: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const [switchState, setSwitchState] = useState(true);
  const handleChange = () => {
  };
  const tableVariant = "compact";
  const tableBorders = false;
  return (
    <>
      <ListBox>
        <TableComposable
          variant={tableVariant}
          borders={tableBorders}
        >
          <Caption>
            <b>Manage SPAs</b>
          </Caption>
          <Tbody>
            <Tr>
              <Td>Name</Td>
              <Td>Path</Td>
              <Td>Action</Td>
            </Tr>
          </Tbody>
          <Tbody>
            {webprop.map((spa: SPAProps) => (
              <Tr key={spa.spaName}>
                <Td dataLabel={spa.spaName}>{spa.spaName}</Td>
                <Td dataLabel={spa.propertyName}>/{spa.spaName}</Td>
                <Td dataLabel={spa.spaName}>
                  <Switch
                    id="spaship-switch"
                    area-label="spaship-switch-area"
                    isChecked={switchState}
                    onChange={handleChange}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      </ListBox>
    </>
  );
};

export default ManageSpa;
