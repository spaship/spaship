/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-key */

import { fetchRoverGroup, fetchUserlist, useAddPermission } from '@app/services/rbac';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Button,
  Checkbox,
  Select,
  SelectOption,
  SelectProps,
  SelectVariant,
  Split,
  SplitItem,
  Tab,
  Tabs,
  TabTitleText,
  Label
} from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { toPascalCase } from '@app/utils/toPascalConvert';

import { UserIcon, UsersIcon, InfoCircleIcon } from '@patternfly/react-icons';
// import TableHeader from '../RBACEditForm';

type RoverGropListItem = {
  email: string;
  isOpen: boolean;
  name: string;
  role: string;
};

type GroupItem1 = {
  email: string;
  name: string;
  role: string;
  PERMISSION_CREATION: boolean;
  PERMISSION_DELETION: boolean;
  ENV_SYNC: boolean;
  ENV_CREATION: boolean;
  APIKEY_DELETION: boolean;
  APIKEY_CREATION: boolean;
  [key: string]: any;
};

type Props = {
  // onSubmit: (data: FormData) => void;
  onClose: () => void;
};
type AddPermType = {
  actions: [];
  email: string;
  name: string;
}[];

type AddDataType = {
  propertyIdentifier: string;
  permissionDetails: AddPermType;
};
type ColumnNames = {
  NAME: string;
  APIKEY_CREATION: string;
  APIKEY_DELETION: string;
  PERMISSION_CREATION: string;
  PERMISSION_DELETION: string;
  ENV_CREATION: string;
  ENV_SYNC: string;
  [key: string]: string;
};

type RoleOptionKey =
  | 'APIKEY_CREATION'
  | 'APIKEY_DELETION'
  | 'ENV_CREATION'
  | 'ENV_SYNC'
  | 'PERMISSION_CREATION'
  | 'PERMISSION_DELETION';
type Role = {
  User: RoleOptionKey[];
  Owner: RoleOptionKey[];
};
export const AddMembers = ({ onClose }: Props): JSX.Element => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<any[]>([]);
  const [isShowAdvancedViewEnabled, setIsShowAdvancedViewEnabled] = React.useState(false);
  const [isShowAdvancedViewEnabledRover, setIsShowAdvancedViewEnabledRover] = React.useState(false);
  const titleId = 'plain-typeahead-select-id';
  const [userList, setUserList] = React.useState<any[]>([]);
  const [group, setGroup] = React.useState<any>({});
  const [newUserDetails, setnewUserDetails] = React.useState<any[]>([]);
  const [expanded, setExpanded] = React.useState('def-list-toggle2');
  const { query } = useRouter();
  const [roverList, setRoverList] = React.useState<any[]>([]);
  const propertyIdentifier = query.propertyIdentifier as string;

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const columnNames2: ColumnNames = {
    NAME: 'Name',
    APIKEY_CREATION: 'APIKEY_CREATION',
    APIKEY_DELETION: 'APIKEY_DELETION',
    PERMISSION_CREATION: 'PERMISSION_CREATION',
    PERMISSION_DELETION: 'PERMISSION_DELETION',
    ENV_CREATION: 'ENV_CREATION',
    ENV_SYNC: 'ENV_SYNC'
  };

  interface User {
    name: string;
    email: string;
    role: keyof Role;
  }

  // useEffect(() => {
  //   const data: any[] = [];
  //   let temp: any = {};

  //   const userDetails = activeTabKey === 0 ? newUserDetails : roverList;
  //   userDetails.forEach((user: User) => {
  //     temp = {};
  //     temp.name = user.name;
  //     temp.email = user.email;
  //     role[user.role].forEach((optionKey: string) => {
  //       temp[optionKey] = true;
  //     });
  //     data.push(temp);
  //   });

  //   setGroup({ data });
  // }, [JSON.stringify(newUserDetails), selected, roverList, activeTabKey]);
  // useEffect(() => {
  //   const role: Role = {
  //     User: ['APIKEY_CREATION', 'ENV_CREATION', 'ENV_SYNC'],
  //     Owner: [
  //       'APIKEY_CREATION',
  //       'APIKEY_DELETION',
  //       'ENV_CREATION',
  //       'ENV_SYNC',
  //       'PERMISSION_CREATION',
  //       'PERMISSION_DELETION'
  //     ]
  //   };
  //   const data: any[] = [];
  //   let temp: any = {};

  //   const userDetails = activeTabKey === 0 ? newUserDetails : roverList;
  //   userDetails.forEach((user: User) => {
  //     temp = {};
  //     temp.name = user.name;
  //     temp.email = user.email;
  //     role[user.role].forEach((optionKey: string) => {
  //       temp[optionKey] = true;
  //     });
  //     data.push(temp);
  //   });

  //   setGroup({ data });
  // }, [JSON.stringify(newUserDetails), selected, roverList, activeTabKey, newUserDetails]);

  const userDetailsString = JSON.stringify(newUserDetails);

  useEffect(() => {
    const role: Role = {
      User: ['APIKEY_CREATION', 'ENV_CREATION', 'ENV_SYNC'],
      Owner: [
        'APIKEY_CREATION',
        'APIKEY_DELETION',
        'ENV_CREATION',
        'ENV_SYNC',
        'PERMISSION_CREATION',
        'PERMISSION_DELETION'
      ]
    };
    const data: any[] = [];
    let temp: any = {};

    const userDetails = activeTabKey === 0 ? newUserDetails : roverList;

    userDetails.forEach((user: User) => {
      temp = {};
      temp.name = user.name;
      temp.email = user.email;
      role[user.role].forEach((optionKey: string) => {
        temp[optionKey] = true;
      });
      data.push(temp);
    });

    setGroup({ data });
  }, [selected, roverList, activeTabKey, newUserDetails, userDetailsString]);

  const onToggle = (isOpenDD: boolean) => {
    if (userList.length) {
      setIsOpen(isOpenDD);
    }
  };

  const onSelect: SelectProps['onSelect'] = (event, selection) => {
    if (selected.includes(selection)) {
      setSelected((prevState: string[]) => prevState.filter((item) => item !== selection));
      setGroup((prevState: { data: { name: string }[] }) => {
        const newData = prevState.data.filter((item) => item.name !== selection);
        return { data: newData };
      });
      setnewUserDetails((prevState: { name: string }[]) =>
        prevState.filter((item) => item.name !== selection)
      );
    } else {
      setSelected((prevState: string[]) => [...prevState, selection]);
    }
  };

  const onToggleAccordian = (id: string) => {
    setExpanded(id === expanded ? '' : id);
  };
  const handleChange = (
    checked: boolean,
    event: React.FormEvent<HTMLInputElement>,
    name: string,
    email: string
  ) => {
    const target = event.currentTarget;
    const temp = [...group.data];
    const index = temp.findIndex((e: RoverGropListItem) => e.email === email);
    if (index >= 0) {
      temp[index] = { ...temp[index], [target.name]: checked };
      setGroup({ data: temp });
    }
  };

  const onToggleAccess = (isOpenAcc: boolean, email: string) => {
    setnewUserDetails((prevDetails) => {
      const temp = [...prevDetails];
      const index = temp.findIndex((m) => m.email === email);
      if (index >= 0) {
        temp[index] = { ...temp[index], isOpen: isOpenAcc };
      }
      return temp;
    });
  };

  const onSelectAccess = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string,
    isPlaceholder: boolean,
    email: string
  ) => {
    setnewUserDetails((prevDetails) => {
      const temp = [...prevDetails];
      const index = temp.findIndex((m) => m.email === email);
      if (index >= 0) {
        temp[index] = { ...temp[index], isOpen: false, role: selection };
      }
      return temp;
    });
  };

  const handleAddMemberClick = (event: React.MouseEvent | React.ChangeEvent, option: any) => {
    setnewUserDetails((prevDetails) => {
      const temp = [...prevDetails];
      const check = temp.find((key) => key.name === option.name);
      if (!check) {
        temp.push({ ...option, role: 'User', isOpen: false });
      }
      return temp;
    });
  };

  const useAddPermission1 = useAddPermission(propertyIdentifier);

  const handleSubmit = async () => {
    const addData: Partial<AddDataType> = { propertyIdentifier };
    const addPerm: AddPermType = group.data
      .filter((v: { [key: string]: any }) => v.email)
      .map((v: { [key: string]: any }) => {
        const tempActions: string[] = Object.keys(v).filter(
          (a) => v[a] && a !== 'name' && a !== 'email' && a !== 'role'
        );
        return { name: v.name, email: v.email, actions: tempActions };
      });
    addData.permissionDetails = addPerm;

    await useAddPermission1.mutateAsync(addData as any).then(() => {
      toast.success('Members added successfully');
    });
    onClose();
  };

  const onToggleRover = () => {};

  const onSelectRover: SelectProps['onSelect'] = (event, selection) => {
    setGroup((prevGroup: { data: { name: string }[] }) => ({
      data: prevGroup.data.filter((n: { name: string }) => n.name !== selection)
    }));
  };

  const clearSelection = () => {
    if (activeTabKey === 0) {
      setSelected([]);
      setGroup({ data: {} });
      setnewUserDetails([]);
      setIsOpen(false);
    } else {
      // setSelectedRover([]);
      setGroup({ data: {} });
      setUserList([]);
    }
  };
  const addRoleToRoverGroup = (roverGroupList: any) => {
    if (roverGroupList) {
      const updatedRoverGroupList = roverGroupList.map((item: any) => ({
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
    let timer: any;

    return (
      e: React.ChangeEvent<HTMLInputElement> | null,
      value: string
    ): React.ReactElement[] | undefined => {
      clearInterval(timer);

      timer = setTimeout(async () => {
        if (value.length >= 3) {
          if (selectedTab === 0) {
            const res = await fetchUserlist(value);
            await setUserList(res);
            setIsOpen(true);
          } else if (selectedTab === 1) {
            const res = await fetchRoverGroup(value);
            await addRoleToRoverGroup(res);
          }
        }
      }, delay);
      return
    };
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
        aria-label="Default content - users"
      >
        <div>
          <br />
          Email
          <br />
          <br />
          <Select
            variant={SelectVariant.typeaheadMulti}
            onFilter={debounceCustomCombined(500, activeTabKey)}
            onToggle={onToggle}
            onSelect={onSelect}
            onClear={clearSelection}
            selections={selected}
            isOpen={isOpen}
            aria-labelledby={titleId}
            placeholderText="Kindly enter name or email"
          >
            {(userList || []).map((option) => (
              <SelectOption
                key={option.id}
                value={option.name}
                onClick={(e) => handleAddMemberClick(e, option)}
              />
            ))}
          </Select>
          <br />
          <Button
            style={{ display: 'flex', float: 'right' }}
            variant="link"
            isInline
            onClick={() => {
              setIsShowAdvancedViewEnabled(!isShowAdvancedViewEnabled);
            }}
          >
            Show Advance Access
          </Button>
          <br />
          <b>New Members</b>
          <br />
          <br />
          {isShowAdvancedViewEnabled && Object.keys(columnNames2).length ? (
            <TableComposable>
              <Thead noWrap>
                <Tr>
                  {Object.values(columnNames2).map((column) => (
                    <Th key={column}>{toPascalCase(column)}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(group).length &&
                  group.data.map((i: GroupItem1) => (
                    <Tr key={i.name}>
                      <Td>{i.name}</Td>
                      {[
                        { id: 'APIKEY_CREATION', value: i.APIKEY_CREATION },
                        { id: 'APIKEY_DELETION', value: i.APIKEY_DELETION },
                        { id: 'PERMISSION_CREATION', value: i.PERMISSION_CREATION },
                        { id: 'PERMISSION_DELETION', value: i.PERMISSION_DELETION },
                        { id: 'ENV_CREATION', value: i.ENV_CREATION },
                        { id: 'ENV_SYNC', value: i.ENV_SYNC }
                      ].map((item) => (
                        <Td key={item.id}>
                          <Checkbox
                            isChecked={item.value}
                            onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
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
                {newUserDetails.map((v) => (
                  <AccordionItem>
                    <AccordionToggle
                      onClick={() => {
                        onToggleAccordian(`def-list-toggle1_${v?.email}`);
                      }}
                      isExpanded={expanded === `def-list-toggle1_${v?.email}`}
                      id="def-list-toggle1_"
                    >
                      <Split>
                        <SplitItem isFilled onClick={(e) => e.stopPropagation()}>
                          {v.name}
                          <br />
                          {v.email}
                        </SplitItem>
                        <SplitItem isFilled />
                        <SplitItem onClick={(e) => e.stopPropagation()}>
                          <Select
                            id={`access_${v.email}`}
                            variant={SelectVariant.single}
                            placeholderText="Access"
                            aria-label="Access"
                            onToggle={(flagOpen) => onToggleAccess(flagOpen, v.email)}
                            onSelect={(e, s, p) => onSelectAccess(e, s as any, p as any, v.email)}
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
                          {Object.keys(group).length &&
                            group.data.map(
                              (i: GroupItem1) =>
                                i.name === v.name && (
                                  <Tr key={i.name}>
                                    <Td>{i.name}</Td>
                                    {[
                                      { id: 'APIKEY_CREATION', value: i.APIKEY_CREATION },
                                      { id: 'APIKEY_DELETION', value: i.APIKEY_DELETION },
                                      { id: 'PERMISSION_CREATION', value: i.PERMISSION_CREATION },
                                      { id: 'PERMISSION_DELETION', value: i.PERMISSION_DELETION },
                                      { id: 'ENV_CREATION', value: i.ENV_CREATION },
                                      { id: 'ENV_SYNC', value: i.ENV_SYNC }
                                    ].map((item) => (
                                      <Td key={item.id}>
                                        <Checkbox
                                          isChecked={item.value}
                                          onChange={(checked, e) =>
                                            handleChange(checked, e, i.name, i.email)
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
          <br />
          <Button
            isDisabled={Object.keys(group).length && group?.data.length === 0 ? true : undefined}
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
        aria-label="Default content - users"
      >
        <div>
          <br />
          Add Rover Group
          <br />
          <br />
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
                key={option.id}
                value={option.name}
                onClick={(e) => handleAddMemberClick(e, option)}
              />
            ))}
          </Select>
          <Label isCompact variant="filled" icon={<InfoCircleIcon />} color="blue">
            Please select all roles to make a user OWNER
          </Label>{' '}
          <Button
            style={{ display: 'flex', float: 'right' }}
            variant="link"
            isInline
            onClick={() => {
              setIsShowAdvancedViewEnabledRover(!isShowAdvancedViewEnabledRover);
            }}
          >
            Show Advance Access Rover
          </Button>
          <br />
          <br />
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
                {Object.keys(group).length &&
                  group.data.map((i: GroupItem1) => (
                    <Tr key={i.name}>
                      <Td>{i.name}</Td>
                      {[
                        { id: 'APIKEY_CREATION', value: i.APIKEY_CREATION },
                        { id: 'APIKEY_DELETION', value: i.APIKEY_DELETION },
                        { id: 'PERMISSION_CREATION', value: i.PERMISSION_CREATION },
                        { id: 'PERMISSION_DELETION', value: i.PERMISSION_DELETION },
                        { id: 'ENV_CREATION', value: i.ENV_CREATION },
                        { id: 'ENV_SYNC', value: i.ENV_SYNC }
                      ].map((item) => (
                        <Td key={item.id}>
                          <Checkbox
                            isChecked={item.value}
                            onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
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
                  <AccordionItem>
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
                          <br />
                          {v.email}
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
                          {Object.keys(group).length &&
                            group.data.map(
                              (i: GroupItem1) =>
                                i.name === v.name && (
                                  <Tr key={i.name}>
                                    <Td>{i.name}</Td>
                                    {[
                                      { id: 'APIKEY_CREATION', value: i.APIKEY_CREATION },
                                      { id: 'APIKEY_DELETION', value: i.APIKEY_DELETION },
                                      { id: 'PERMISSION_CREATION', value: i.PERMISSION_CREATION },
                                      { id: 'PERMISSION_DELETION', value: i.PERMISSION_DELETION },
                                      { id: 'ENV_CREATION', value: i.ENV_CREATION },
                                      { id: 'ENV_SYNC', value: i.ENV_SYNC }
                                    ].map((item) => (
                                      <Td key={item.id}>
                                        <Checkbox
                                          isChecked={item.value}
                                          onChange={(checked, e) =>
                                            handleChange(checked, e, i.name, i.email)
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
            isDisabled={Object.keys(group).length && group?.data.length === 0 ? true : undefined}
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
