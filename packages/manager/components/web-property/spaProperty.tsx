import { Button, Card, EmptyState, EmptyStateBody, EmptyStateIcon, Flex, FlexItem, Label, SearchInput, Title } from "@patternfly/react-core";
import { ClockIcon, CubesIcon, ExternalLinkAltIcon, SearchIcon } from "@patternfly/react-icons";
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

const StyledExternalLinkAltIcon = styled(ExternalLinkAltIcon)`
  margin-right: 0.5rem;
`;

const SPAProperty: FunctionComponent<Properties> = ({ webprop, }: Properties) => {
  const router = useRouter();
  const { envList } = webprop;
  const tableView: Array<SPAProperty> = Object.values(webprop?.countResponse?.reduce((acc: any, spa: any) => {
    const url = `${envList.find((environment: any) => environment.env === spa.env).url}${spa.path.startsWith('/') ? spa.path : `/${spa.path}`}`;
    if (spa.accessUrl.length > 0) {
      if (acc.hasOwnProperty(spa.identifier)) {
        acc[spa.identifier].env.push(spa.env);
        acc[spa.identifier].details.push(
          {
            env: spa.env,
            name: spa.name,
            url,
            ref: spa.ref,
            updatedAt: spa.updatedAt,
            accessUrl: spa.accessUrl ?? spa.accessUrl.endsWith('/') ? spa.accessUrl : `${spa.accessUrl}/`,
            identifier: spa.identifier
          }
        )
        return acc;
      }
      acc[spa.identifier] = {
        ...spa,
        env: [spa.env],
        details: [
          {
            env: spa.env,
            url,
            ref: spa.ref,
            updatedAt: spa.updatedAt,
            accessUrl: spa.accessUrl ?? spa.accessUrl.endsWith('/') ? spa.accessUrl : `${spa.accessUrl}/`,
          },
        ],
      }
      return acc;
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
    return function (value: string) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setTableData(tableView.filter((item: any) => item.name.toLowerCase().includes(value.toLowerCase())))
      }, delay)
    }
  }
  const onSearch = debounce(300);
  const onClear = () => setSearchValue('');
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
          {
            <Tbody>
              <Tr>
                <Td colSpan={4}>
                  {
                    !!!tableData.length &&
                    <EmptyState>
                      <EmptyStateIcon icon={SearchIcon} />
                      <Title headingLevel="h4" size="lg">
                        No results found
                      </Title>
                      <EmptyStateBody>
                        Search for another SPA name.
                      </EmptyStateBody>
                    </EmptyState>
                  }
                </Td>
              </Tr>
            </Tbody>
          }
          {tableData.map((spa: SPAProperty, rowIndex: any) => (
            <Tbody key={spa.name} isExpanded={isSPAExpanded(spa.name)}>
              <Tr key={spa.name} {... (rowIndex % 2 === 0) && { isStriped: true }}>
                <Td
                  expand={
                    spa ? {
                      rowIndex,
                      isExpanded: isSPAExpanded(spa.name),
                      onToggle: () => setSpaExpanded(spa.name, !isSPAExpanded(spa.name)),
                    } : undefined
                  } />
                <Td>
                  <Button onClick={() => router.push(`${spa.propertyName}/spa/${spa.identifier}`)} variant="link" isInline>
                    {spa.name}
                  </Button>
                </Td>
                <Td> {spa.path.startsWith('/') ? spa.path : `/${spa.path}`} </Td>
                <Td>{spa.env.map((envName: string, _index: any) => <StyledLabel key={_index}>{envName}</StyledLabel>)}</Td>
              </Tr>
              <Tr key={rowIndex} isExpanded={isSPAExpanded(spa.name)}>
                <Td colSpan={5}>
                  <ExpandableRowContent>
                    <TableComposable variant="compact" borders={false} isStriped>
                      <StyledTableHeader>
                        <Tr>
                          <Th>Environment</Th>
                          <Th>Ref</Th>
                          <Th>URL</Th>
                          <Th>Internal Access URL</Th>
                          <Th>Updated At</Th>
                        </Tr>
                      </StyledTableHeader>
                      <Tbody>
                        {(spa as any).details.map((detail: any, index: any) =>
                          <Tr key={index}>
                            <Td><StyledLabel>{detail.env}</StyledLabel></Td>
                            <Td>{detail.ref.length > lengthLimit ? `${detail.ref.substring(0, lengthLimit)}...` : detail.ref}</Td>
                            <Td>
                              <a
                                href={`https://${detail.url}`}
                                target="_blank"
                                rel="noopener noreferrer">
                                <StyledExternalLinkAltIcon />
                                {detail.url.length > lengthLimit ? `${detail.url.substring(0, lengthLimit)}...` : detail.url}
                              </a>
                            </Td>
                            <Td>
                              {
                                detail.accessUrl
                                  ?
                                  <a
                                    href={`${detail.accessUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <StyledExternalLinkAltIcon />
                                    {`${detail.accessUrl.substring(0, lengthLimit)}...`}
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
