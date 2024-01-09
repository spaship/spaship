/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-return */
import { fetchRoverGroup, fetchUserlist, useAddPermission } from '@app/services/rbac';
import { toPascalCase } from '@app/utils/toPascalConvert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Button,
  Checkbox,
  Flex,
  FlexItem,
  Label,
  Select,
  SelectOption,
  SelectProps,
  SelectVariant,
  Split,
  SplitItem,
  Tab,
  Tabs,
  TabTitleText
} from '@patternfly/react-core';
import { InfoCircleIcon, UserIcon, UsersIcon } from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useRouter } from 'next/router';
import { useEffect, useState, MouseEvent, ChangeEvent, FormEvent, ReactElement } from 'react';
import toast from 'react-hot-toast';
import {
  AddDataType,
  ColumnNames,
  NewRoverData,
  RoverItem,
  RoverUserList,
  UserDataItem,
  UserDataDTO,
  UserRoleDTO
} from './types';

type Props = {
  onClose: () => void;
};

const columnNames2: ColumnNames = {
  NAME: 'Name',
  APIKEY_CREATION: 'APIKEY_CREATION',
  APIKEY_DELETION: 'APIKEY_DELETION',
  PERMISSION_CREATION: 'PERMISSION_CREATION',
  PERMISSION_DELETION: 'PERMISSION_DELETION',
  ENV_CREATION: 'ENV_CREATION',
  ENV_SYNC: 'ENV_SYNC',
  APPLICATION_CREATION: 'APPLICATION_CREATION '
};
const userRole: UserRoleDTO = {
  User: ['APIKEY_CREATION', 'ENV_CREATION', 'ENV_SYNC', 'APPLICATION_CREATION'],
  Owner: [
    'APIKEY_CREATION',
    'APIKEY_DELETION',
    'ENV_CREATION',
    'ENV_SYNC',
    'PERMISSION_CREATION',
    'PERMISSION_DELETION',
    'APPLICATION_CREATION'
  ]
};
export const AddMembersForm = ({ onClose }: Props): JSX.Element => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const [isOpenUser, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isShowAdvancedViewEnabled, setIsShowAdvancedViewEnabled] = useState(false);
  const [isShowAdvancedViewEnabledRover, setIsShowAdvancedViewEnabledRover] = useState(false);
  const titleId = 'plain-typeahead-select-id';
  const [userListFromRover, setUserListFromRover] = useState<RoverUserList>([]);
  const [usersData, setUsersData] = useState<UserDataDTO>({ data: [] });
  const [newUserDetails, setNewUserDetails] = useState<NewRoverData[]>([]);
  const [expanded, setExpanded] = useState('def-list-toggle2');
  const { query } = useRouter();
  const [roverList, setRoverList] = useState<NewRoverData[]>([]);
  const propertyIdentifier = query.propertyIdentifier as string;
  const addPermission = useAddPermission(propertyIdentifier);

  const handleTabClick = (
    _event: MouseEvent<any> | KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const userDetailsString = JSON.stringify(newUserDetails);

  useEffect(() => {
    const userDetails: NewRoverData[] = activeTabKey === 0 ? newUserDetails : roverList;
    const res1 = userDetails.map(({ name, email, role, isOpen }) => ({
      name,
      email,
      role,
      isOpen,
      ...userRole[role].reduce((acc, cur) => ({ ...acc, [cur]: true }), {})
    }));
    setUsersData({ data: res1 });
  }, [selectedUsers, roverList, activeTabKey, newUserDetails, userDetailsString]);

  const onToggle = (isOpenDD: boolean) => {
    if (userListFromRover.length) {
      setIsOpen(isOpenDD);
    }
  };

  const onSelect = (_event: MouseEvent | ChangeEvent, selection: string) => {
    if (selectedUsers.includes(selection)) {
      setSelectedUsers((prevState: string[]) => prevState.filter((item) => item !== selection));
      setUsersData((prevState: UserDataDTO) => {
        const newData = prevState.data.filter((item) => item.name !== selection);
        return { data: newData };
      });
      setNewUserDetails((prevState: NewRoverData[]) =>
        prevState.filter((item) => item.name !== selection)
      );
    } else {
      setSelectedUsers((prevState: string[]) => [...prevState, selection]);
    }
  };

  const onToggleAccordian = (id: string) => {
    setExpanded(id === expanded ? '' : id);
  };

  const handleCheckBoxChange = (
    checked: boolean,
    event: FormEvent<HTMLInputElement>,
    _name: string,
    email: string
  ) => {
    const target = event.currentTarget;
    const temp = [...usersData.data];
    const index = temp.findIndex((e: NewRoverData) => e.email === email);
    if (index >= 0) {
      temp[index] = { ...temp[index], [target.name]: checked };
      setUsersData({ data: temp });
    }
  };

  const onToggleAccess = (isOpenAcc: boolean, email: string) => {
    setNewUserDetails((prevDetails) => {
      const temp = [...prevDetails];
      const index = temp.findIndex((m) => m.email === email);
      if (index >= 0) {
        temp[index] = { ...temp[index], isOpen: isOpenAcc };
      }
      return temp;
    });
  };

  const onSelectAccess = (_event: MouseEvent | ChangeEvent, selection: string, email: string) => {
    setNewUserDetails((prevDetails) => {
      const temp = [...prevDetails];
      const index = temp.findIndex((m) => m.email === email);
      if (index >= 0) {
        temp[index] = { ...temp[index], isOpen: false, role: selection };
      }
      return temp;
    });
  };

  const handleAddMemberClick = (_event: MouseEvent | ChangeEvent, option: RoverItem) => {
    setNewUserDetails((prevDetails) => {
      const temp = [...prevDetails];
      const check = temp.find((key) => key.name === option.name);
      if (!check) {
        temp.push({ ...option, role: 'User', isOpen: false });
      }
      return temp;
    });
  };

  const onToggleRover = () => {};
  const onSelectRover: SelectProps['onSelect'] = (_event, selection) => {
    setUsersData((prevGroup: UserDataDTO) => ({
      data: prevGroup.data.filter((n: { name: string }) => n.name !== selection)
    }));
  };

  const clearSelection = () => {
    if (activeTabKey === 0) {
      setSelectedUsers([]);
      setUsersData({ data: [] });
      setNewUserDetails([]);
      setIsOpen(false);
    } else {
      setUsersData({ data: [] });
      setUserListFromRover([]);
    }
  };

  const addRoleToRoverGroup = (roverGroupList: RoverItem[]) => {
    if (roverGroupList) {
      const updatedRoverGroupList = roverGroupList.map((item: RoverItem) => ({
        ...item,
        role: 'User',
        isOpen: false
      }));
      setRoverList(updatedRoverGroupList);
    } else {
      toast.error('Please enter a valid Rover Group Common Name (cn)');
    }
  };

  const debounceCustomCombined = (
    delay: number,
    selectedTab: string | number
  ): SelectProps['onFilter'] => {
    let timer: NodeJS.Timeout;
    return (
      _e: ChangeEvent<HTMLInputElement> | null,
      value: string
    ): ReactElement[] | undefined => {
      clearInterval(timer);
      timer = setTimeout(async () => {
        if (value.length >= 3) {
          if (selectedTab === 0) {
            const res = await fetchUserlist(value);
            setUserListFromRover(res);
            setIsOpen(true);
          } else if (selectedTab === 1) {
            const res = await fetchRoverGroup(value);
            addRoleToRoverGroup(res);
          }
        }
      }, delay);
      return;
    };
  };

  const handleSubmit = () => {
    const addData: AddDataType = {
      propertyIdentifier,
      permissionDetails: usersData.data.map(({ email, name, ...rand }) => ({
        email,
        name,
        actions: Object.keys(rand)
      }))
    };
    addPermission.mutateAsync(addData).then(() => {
      toast.success('Members added successfully');
    });
    onClose();
  };

  return (
    <Tabs
      activeKey={activeTabKey}
      onSelect={handleTabClick}
      isBox={false}
      aria-label="Tabs in the default example"
      role="region"
    >
      <Tab
        eventKey={0}
        title={
          <TabTitleText>
            <UserIcon /> Email
          </TabTitleText>
        }
        aria-label="Default content - usersData"
      >
        <div>
          <div className="pf-u-my-lg">Email</div>
          <Select
            variant={SelectVariant.typeaheadMulti}
            onFilter={debounceCustomCombined(500, activeTabKey)}
            onToggle={onToggle}
            onSelect={(e, s) => onSelect(e, s as string)}
            onClear={clearSelection}
            selections={selectedUsers}
            isOpen={isOpenUser}
            aria-labelledby={titleId}
            placeholderText="Kindly enter name or email"
            className="pf-u-mb-lg"
            maxHeight={200}
          >
            {(userListFromRover || []).map((option) => (
              <SelectOption
                key={option.name}
                value={option.name}
                onClick={(e) => handleAddMemberClick(e, option)}
              />
            ))}
          </Select>
          <div className="--pf-global--spacer--md" />
          <Button
            style={{ display: 'flex', float: 'right' }}
            variant="link"
            isInline
            onClick={() => {
              setIsShowAdvancedViewEnabled(!isShowAdvancedViewEnabled);
            }}
            className="pf-u-mb-lg"
          >
            {!isShowAdvancedViewEnabled ? 'Show Detailed Permissions' : 'Hide Detailed Permissions'}
          </Button>
          <div className="pf-u-my-lg">
            <b>New Members</b>
          </div>
          {isShowAdvancedViewEnabled && Object.keys(columnNames2).length ? (
            <TableComposable className="pf-u-mb-lg" style={{ maxHeight: '200' }}>
              <Thead noWrap>
                <Tr>
                  {Object.values(columnNames2).map((column) => (
                    <Th key={column}>{toPascalCase(column)}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(usersData).length &&
                  usersData.data.map((i: UserDataItem) => (
                    <Tr key={i.name}>
                      <Td>{i.name}</Td>
                      {[
                        { id: 'APIKEY_CREATION', value: i.APIKEY_CREATION },
                        { id: 'APIKEY_DELETION', value: i.APIKEY_DELETION },
                        { id: 'PERMISSION_CREATION', value: i.PERMISSION_CREATION },
                        { id: 'PERMISSION_DELETION', value: i.PERMISSION_DELETION },
                        { id: 'ENV_CREATION', value: i.ENV_CREATION },
                        { id: 'ENV_SYNC', value: i.ENV_SYNC },
                        { id: 'APPLICATION_CREATION', value: i.APPLICATION_CREATION }
                      ].map((item) => (
                        <Td key={item.id}>
                          <Checkbox
                            isChecked={Boolean(item.value)}
                            onChange={(checked, e) =>
                              handleCheckBoxChange(checked, e, i.name, i.email)
                            }
                            id={`${columnNames2[item.id]}`}
                            name={`${columnNames2[item.id]}`}
                          />
                        </Td>
                      ))}
                    </Tr>
                  ))}
              </Tbody>
            </TableComposable>
          ) : (
            <div style={{ maxHeight: '35vh', overflowY: 'auto' }}>
              <Accordion asDefinitionList className="pf-u-mb-lg">
                {newUserDetails.map((v) => (
                  <AccordionItem key={v.email}>
                    <AccordionToggle
                      onClick={() => {
                        onToggleAccordian(`def-list-toggle1_${v?.email}`);
                      }}
                      isExpanded={expanded === `def-list-toggle1_${v?.email}`}
                      id="def-list-toggle1_"
                    >
                      <Split hasGutter>
                        <SplitItem isFilled onClick={(e) => e.stopPropagation()}>
                          <b>{v.name}</b>
                          <p className="pf-u-mt-xs">{v.email}</p>
                        </SplitItem>
                        <SplitItem isFilled />
                        <SplitItem onClick={(e) => e.stopPropagation()}>
                          <Select
                            id={`access_${v.email}`}
                            variant={SelectVariant.single}
                            placeholderText="Access"
                            aria-label="Access"
                            onToggle={(flagOpen) => onToggleAccess(flagOpen, v.email)}
                            onSelect={(e, s) => onSelectAccess(e, s as string, v.email)}
                            selections={v.role}
                            isOpen={v.isOpen}
                            menuAppendTo={() => document.body}
                            value={v.role}
                            isPlain
                          >
                            <SelectOption key={`user_${v.email}`} value="User">
                              User
                            </SelectOption>
                            <SelectOption key={`owner_${v.email}`} value="Owner">
                              Owner
                            </SelectOption>
                          </Select>
                        </SplitItem>
                      </Split>
                    </AccordionToggle>
                    <AccordionContent
                      id={`def-list-expand1${v.email}`}
                      isHidden={expanded !== `def-list-toggle1_${v.email}`}
                    >
                      <TableComposable>
                        <Thead noWrap>
                          <Tr>
                            {Object.values(columnNames2).map((column) => (
                              <Th key={column}>{toPascalCase(column)}</Th>
                            ))}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {Object.keys(usersData).length &&
                            usersData.data.map(
                              (i: UserDataItem) =>
                                i.name === v.name && (
                                  <Tr key={i.name} className="pf-u-mb-md">
                                    <Td>{i.name}</Td>
                                    {[
                                      { id: 'APIKEY_CREATION', value: i.APIKEY_CREATION },
                                      { id: 'APIKEY_DELETION', value: i.APIKEY_DELETION },
                                      { id: 'PERMISSION_CREATION', value: i.PERMISSION_CREATION },
                                      { id: 'PERMISSION_DELETION', value: i.PERMISSION_DELETION },
                                      { id: 'ENV_CREATION', value: i.ENV_CREATION },
                                      { id: 'ENV_SYNC', value: i.ENV_SYNC },
                                      { id: 'APPLICATION_CREATION', value: i.APPLICATION_CREATION }
                                    ].map((item) => (
                                      <Td key={item.id}>
                                        <Checkbox
                                          isChecked={Boolean(item.value)}
                                          onChange={(checked, e) =>
                                            handleCheckBoxChange(checked, e, i.name, i.email)
                                          }
                                          id={`${columnNames2[item.id]}`}
                                          name={`${columnNames2[item.id]}`}
                                        />
                                      </Td>
                                    ))}
                                  </Tr>
                                )
                            )}
                        </Tbody>
                      </TableComposable>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          <Button
            isDisabled={
              Object.keys(usersData).length && usersData?.data.length === 0 ? true : undefined
            }
            variant="primary"
            onClick={handleSubmit}
          >
            Add Members
          </Button>
        </div>
      </Tab>
      <Tab
        eventKey={1}
        title={
          <TabTitleText>
            <UsersIcon /> Rover Group
          </TabTitleText>
        }
        aria-label="Default content - usersData"
      >
        <div>
          <div className="pf-u-my-lg">Add Rover Group</div>
          <Select
            variant={SelectVariant.typeaheadMulti}
            onFilter={debounceCustomCombined(1000, activeTabKey)}
            onToggle={onToggleRover}
            onSelect={onSelectRover}
            onClear={clearSelection}
            aria-labelledby={titleId}
            placeholderText="Kindly put 'Rover group Common Name'"
          >
            {(roverList || []).map((option) => (
              <SelectOption
                key={option.name}
                value={option.name}
                onClick={(e) => handleAddMemberClick(e, option)}
              />
            ))}
          </Select>
          <Flex alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Label isCompact variant="filled" icon={<InfoCircleIcon />} color="blue">
                Please select all roles to make a user OWNER
              </Label>
            </FlexItem>
            <FlexItem align={{ default: 'alignRight' }}>
              <Button
                variant="link"
                isInline
                onClick={() => {
                  setIsShowAdvancedViewEnabledRover(!isShowAdvancedViewEnabledRover);
                }}
                style={{ marginBottom: 'var(--pf-global--spacer--lg)' }}
              >
                {!isShowAdvancedViewEnabledRover
                  ? ' Show Detailed Rover Permissions'
                  : 'Hide Detailed Permissions Rover'}
              </Button>
            </FlexItem>
          </Flex>
          <div className="--pf-global--spacer--lg" />
          {isShowAdvancedViewEnabledRover && Object.keys(columnNames2).length ? (
            <TableComposable>
              <Thead noWrap>
                <Tr>
                  {Object.values(columnNames2).map((column) => (
                    <Th key={column}>{toPascalCase(column)}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(usersData).length &&
                  usersData.data.map((i: UserDataItem) => (
                    <Tr key={i.name}>
                      <Td>{i.name}</Td>
                      {[
                        { id: 'APIKEY_CREATION', value: i.APIKEY_CREATION },
                        { id: 'APIKEY_DELETION', value: i.APIKEY_DELETION },
                        { id: 'PERMISSION_CREATION', value: i.PERMISSION_CREATION },
                        { id: 'PERMISSION_DELETION', value: i.PERMISSION_DELETION },
                        { id: 'ENV_CREATION', value: i.ENV_CREATION },
                        { id: 'ENV_SYNC', value: i.ENV_SYNC },
                        { id: 'APPLICATION_CREATION', value: i.APPLICATION_CREATION }
                      ].map((item) => (
                        <Td key={item.id}>
                          <Checkbox
                            isChecked={Boolean(item.value)}
                            onChange={(checked, e) =>
                              handleCheckBoxChange(checked, e, i.name, i.email)
                            }
                            id={`${columnNames2[item.id]}`}
                            name={`${columnNames2[item.id]}`}
                          />
                        </Td>
                      ))}
                    </Tr>
                  ))}
              </Tbody>
            </TableComposable>
          ) : (
            <div>
              <Accordion asDefinitionList>
                {(roverList || []).map((v) => (
                  <AccordionItem key={v.email}>
                    <AccordionToggle
                      onClick={() => {
                        onToggleAccordian(`def-list-toggle1_${v.email}`);
                      }}
                      isExpanded={expanded === `def-list-toggle1_${v.email}`}
                      id="def-list-toggle1_"
                    >
                      <Split>
                        <SplitItem onClick={(e) => e.stopPropagation()}>
                          <b>{v.name}</b>

                          <p className="pf-u-mt-xs">{v.email}</p>
                        </SplitItem>
                        <SplitItem isFilled />
                        <SplitItem onClick={(e) => e.stopPropagation()}>
                          <b>{v.role}</b>
                        </SplitItem>
                      </Split>
                    </AccordionToggle>
                    <AccordionContent
                      id={`def-list-expand1${v.email}`}
                      isHidden={expanded !== `def-list-toggle1_${v.email}`}
                    >
                      <TableComposable>
                        <Thead noWrap>
                          <Tr>
                            {Object.values(columnNames2).map((column) => (
                              <Th key={column}>{toPascalCase(column)}</Th>
                            ))}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {Object.keys(usersData).length &&
                            usersData.data.map(
                              (i: UserDataItem) =>
                                i.name === v.name && (
                                  <Tr key={i.name}>
                                    <Td>{i.name}</Td>
                                    {[
                                      { id: 'APIKEY_CREATION', value: i.APIKEY_CREATION },
                                      { id: 'APIKEY_DELETION', value: i.APIKEY_DELETION },
                                      { id: 'PERMISSION_CREATION', value: i.PERMISSION_CREATION },
                                      { id: 'PERMISSION_DELETION', value: i.PERMISSION_DELETION },
                                      { id: 'ENV_CREATION', value: i.ENV_CREATION },
                                      { id: 'ENV_SYNC', value: i.ENV_SYNC },
                                      { id: 'APPLICATION_CREATION', value: i.APPLICATION_CREATION }
                                    ].map((item) => (
                                      <Td key={item.id}>
                                        <Checkbox
                                          isChecked={Boolean(item.value)}
                                          onChange={(checked, e) =>
                                            handleCheckBoxChange(checked, e, i.name, i.email)
                                          }
                                          id={`${columnNames2[item.id]}`}
                                          name={`${columnNames2[item.id]}`}
                                        />
                                      </Td>
                                    ))}
                                  </Tr>
                                )
                            )}
                        </Tbody>
                      </TableComposable>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          <Button
            className="pf-u-mt-md"
            isDisabled={
              Object.keys(usersData).length && usersData?.data.length === 0 ? true : undefined
            }
            variant="primary"
            onClick={handleSubmit}
          >
            Add Members
          </Button>
        </div>
      </Tab>
    </Tabs>
  );
};
