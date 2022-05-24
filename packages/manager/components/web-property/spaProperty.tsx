import { Card, Label } from "@patternfly/react-core";
import { TableComposable, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { Properties } from "../models/props";

const StyledCard = styled(Card)`
  margin-top: 2rem;
`;
const StyledLabel = styled(Label)`
  margin-left: 0.5rem;
`;

const SPAProperty: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const tableView: Array<SPAProperty> = webprop?.reduce(( acc: any, spa: any) => {
    if (!!acc[spa.path]) {
        acc[spa.path].env.push(spa.env);
        return acc;
    }
    acc[spa.path] = { ...spa, env: [spa.env ] }
    return acc;
  }, {});
  return (
    <>
      <StyledCard>
      <TableComposable>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Url</Th>
              <Th>Environment(s)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.values(tableView)?.map((spa: SPAProperty, index: any) => (
              <Tr key={index}>
                <Td>
                 {spa.name}
                </Td>
                <Td> {spa.path} </Td>
                <Td>{ spa.env.map( ( envName:string, _index: any) => <StyledLabel key={_index}>{ envName }</StyledLabel>) }</Td>
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      </StyledCard>
    </>
  );
};

export default SPAProperty;
