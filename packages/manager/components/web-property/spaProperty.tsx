import { Button, Card, Flex, FlexItem, Label, SearchInput } from "@patternfly/react-core";
import { ClockIcon, ExternalLinkAltIcon } from "@patternfly/react-icons";
import { ExpandableRowContent, TableComposable, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { Properties } from "../models/props";

const StyledCard = styled(Card)`
  margin-top: 1rem;
`;
const StyledFlex = styled(Flex)`
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
  const tableView: Array<SPAProperty> = Object.values(webprop?.countResponse?.reduce((acc: any, spa: any) => {
    const url = `${envList.find((environment: any) => environment.env === spa.env).url}${spa.path.startsWith('/') ? spa.path : `/${spa.path}`}`;
    if (acc.hasOwnProperty(spa.name)) {
      acc[spa.name].env.push(spa.env);
      acc[spa.name].details.push(
        {
          env: spa.env,
          url,
          ref: spa.ref,
          updatedAt: spa.updatedAt,
          accessUrl: spa.accessUrl,
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
          updatedAt: spa.updatedAt,
          accessUrl: spa.accessUrl,
        },
      ],
    }
    return acc;
  }, {}));
  const [tableData, setTableData] = useState(tableView);
  const [expandedSpaNames, setExpandedSpaNames] = useState(['']);
  const setSpaExpanded = (spaName: string, isExpanding = true) =>
    setExpandedSpaNames(prevExpandedSpaNames => {
      const otherSpaNames = prevExpandedSpaNames.filter(name => name !== spaName);
      return isExpanding
        ? [...otherSpaNames, spaName]
        : otherSpaNames;
    });
  const isSPAExpanded = (spaName: string) => expandedSpaNames.includes(spaName);
  const [searchValue, setSearchValue] = useState('');
  const debounce = (delay: number,) => {
    let timer: any;
    return function(value: string) {
      clearTimeout(timer);
      timer = setTimeout( () => {
        setTableData(tableView.filter((item: any) => item.name.toLowerCase().includes(value.toLowerCase())))
      }, delay)
     }
  }
  const onSearch = debounce(300);
  const onClear= () => setSearchValue('');
  const lengthLimit = 20;
  return (
    <>
      <StyledFlex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
        <FlexItem>
          <SearchInput
            placeholder="Find by name"
            value={searchValue}
            onChange={onSearch}
            onClear={onClear}
          />
        </FlexItem>
      </StyledFlex>
      <StyledCard>
        <TableComposable>
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Name</Th>
              <Th>URL Path</Th>
              <Th>Environment(s)</Th>
            </Tr>
          </Thead>
          {tableData.map((spa: SPAProperty, rowIndex: any) => (
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
                <Td> {spa.name.startsWith('/') ? spa.name : `/${spa.name}`} </Td>
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
                          <Th>URL</Th>
                          <Th>Access URL</Th>
                          <Th>Updated At</Th>
                        </Tr>
                      </StyledTableHeader>
                      <Tbody>
                        {(spa as any).details.map((detail: any, index: any) =>
                          <Tr key={index}>
                            <Td><StyledLabel>{detail.env}</StyledLabel></Td>
                            <Td>{detail.ref > lengthLimit ? detail.ref.substring(0, lengthLimit) + '...' : detail.ref}</Td>
                            <Td>
                              <a href={`https://${detail.url}`} target="_blank" rel="noopener noreferrer"><ExternalLinkAltIcon /> 
                                {detail.url.length > lengthLimit ? detail.url.substring(0, lengthLimit) + '...' : detail.url} 
                              </a>
                            </Td>
                            <Td>
                              {
                                detail.accessUrl 
                                ? 
                                <a href={`https://${detail.accessUrl}`} target="_blank" rel="noopener noreferrer"><ExternalLinkAltIcon /> 
                                  {detail.accessUrl > lengthLimit ? detail.accessUrl.substring(0, lengthLimit) + '...' : detail.accessUrl} 
                                </a> 
                                :
                                'N/A'
                              }
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
