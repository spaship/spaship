import { Button, Card, Label } from "@patternfly/react-core";
import { ClockIcon, ExternalLinkAltIcon } from "@patternfly/react-icons";
import { ExpandableRowContent, TableComposable, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { Properties } from "../models/props";

const StyledCard = styled(Card)`
  margin-top: 2rem;
`;
const StyledLabel = styled(Label)`
  margin-left: 0.5rem;
`;

const StyledTableHeader = styled(Thead)`
--pf-c-table--border-width--base:none;
`

const SPAProperty: FunctionComponent<Properties> = ({ webprop, }: Properties) => {
  const router = useRouter();
  const { envList } = webprop;
  const tableView: Array<SPAProperty> = webprop?.countResponse?.reduce((acc: any, spa: any) => {
    const url = `${envList.find((environment: any) => environment.env === spa.env).url}${spa.path}`;
    if (!!acc[spa.name]) {
      acc[spa.name].env.push(spa.env);
      acc[spa.name].details.push(
        {
          env: spa.env,
          url,
          ref: spa.ref,
          updatedAt: spa.updatedAt

        }
      )
      return acc;
    }
    acc[spa.name] = {
      ...spa,
      env: [spa.env],
      details: [
        {
          env: spa.env,
          url,
          ref: spa.ref,
          updatedAt: spa.updatedAt
        },
      ],
    }
    return acc;
  }, {});
  const [expandedSpaNames, setExpandedSpaNames] = useState(['']);
  const setSpaExpanded = (spaName: string, isExpanding = true) =>
    setExpandedSpaNames(prevExpandedSpaNames => {
      const otherSpaNames = prevExpandedSpaNames.filter(name => name !== spaName);
      return isExpanding
        ? [...otherSpaNames, spaName]
        : otherSpaNames;
    });
  const isSPAExpanded = (spaName: string) => expandedSpaNames.includes(spaName);
  return (
    <>
      <StyledCard>
        <TableComposable>
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Name</Th>
              <Th>Url</Th>
              <Th>Environment(s)</Th>
            </Tr>
          </Thead>
          {Object.values(tableView)?.map((spa: SPAProperty, rowIndex: any) => (
            <Tbody key={spa.name} isExpanded={isSPAExpanded(spa.name)}>
              <Tr key={spa.name}>
                <Td
                  expand={
                    spa ? {
                      rowIndex,
                      isExpanded: isSPAExpanded(spa.name),
                      onToggle: () => setSpaExpanded(spa.name, !isSPAExpanded(spa.name)),
                    } : undefined
                  } />
                <Td>
                  <Button onClick={() => router.push(`${spa.propertyName}/spa/${spa.name}`)} variant="link" isInline>
                    {spa.name}
                  </Button>
                </Td>
                <Td> {spa.name} </Td>
                <Td>{spa.env.map((envName: string, _index: any) => <StyledLabel key={_index}>{envName}</StyledLabel>)}</Td>
              </Tr>
              <Tr key={rowIndex} isExpanded={isSPAExpanded(spa.name)}>
                <Td colSpan={5}>
                  <ExpandableRowContent>
                    <TableComposable variant="compact" borders={false}>
                      <StyledTableHeader>
                        <Tr>
                          <Th>Environment</Th>
                          <Th>Ref</Th>
                          <Th>Url</Th>
                          <Th>Updated At</Th>
                        </Tr>
                      </StyledTableHeader>
                      <Tbody>
                        {(spa as any).details.map((detail: any, index: any) =>
                          <Tr key={index}>
                            <Td><StyledLabel>{detail.env}</StyledLabel></Td>
                            <Td>{detail.ref}</Td>
                            <Td>
                              <a href={`https://${detail.url}`} target="_blank" rel="noopener noreferrer"><ExternalLinkAltIcon /> {detail.url} </a>
                            </Td>
                            <Td><ClockIcon /> {new Date(detail.updatedAt).toLocaleString('en')}</Td>
                          </Tr>
                        )}
                      </Tbody>
                    </TableComposable>
                  </ExpandableRowContent>
                </Td>
              </Tr>
            </Tbody>
          ))}
        </TableComposable>
      </StyledCard>
    </>
  );
};

export default SPAProperty;
