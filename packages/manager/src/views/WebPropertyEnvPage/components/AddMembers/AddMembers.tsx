/* eslint-disable */
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
  TabTitleText, Label
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

export const AddMembers = ({ onClose }: Props): JSX.Element => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  // const [isBox, setIsBox] = React.useState<boolean>(false);
  // const [value, setValue] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<any[]>([]);
  const [isShowAdvancedViewEnabled, setIsShowAdvancedViewEnabled] = React.useState(false);
  const [isShowAdvancedViewEnabledRover, setIsShowAdvancedViewEnabledRover] = React.useState(false);
  const titleId = 'plain-typeahead-select-id';
  const [userList, setUserList] = React.useState<any[]>([]);
  const [group, setGroup] = React.useState<any>({});
  const [isOpenAccess, setIsOpenAccess] = React.useState(false);
  const [newUserDetails, setnewUserDetails] = React.useState<any[]>([]);
  const [expanded, setExpanded] = React.useState('def-list-toggle2');
  const { query } = useRouter();
  // const [isOpenRover, setIsOpenRover] = React.useState(false);
  const [selectedRover, setSelectedRover] = React.useState<any[]>([]);
  const [roverList, setRoverList] = React.useState<any[]>([]);
  const propertyIdentifier = query.propertyIdentifier as string;

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const columnNames2 = {
    NAME: 'Name',
    // ROLE: 'Role',
    APIKEY_CREATION: 'APIKEY_CREATION',
    APIKEY_DELETION: 'APIKEY_DELETION',
    PERMISSION_CREATION: 'PERMISSION_CREATION',
    PERMISSION_DELETION: 'PERMISSION_DELETION',
    ENV_CREATION: 'ENV_CREATION',
    ENV_SYNC: 'ENV_SYNC'
  };

  const role: any = {
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
  useEffect(() => {
    const data: any[] = [];
    let temp: any = {};

    const userDetails = activeTabKey === 0 ? newUserDetails : roverList;
    userDetails.forEach((user: any) => {
      temp = {};
      temp.name = user.name;
      temp.email = user.email;
      role[user.role].forEach((optionKey: string) => {
        temp[optionKey] = true;
      });
      data.push(temp);
    });

    setGroup({ data });
    
  }, [JSON.stringify(newUserDetails), selected, roverList, activeTabKey]);

  const onToggle = (isOpen: boolean) => {
    if (userList.length) {
      setIsOpen(isOpen);
    }
  };

  const onSelect: SelectProps['onSelect'] = (event, selection) => {
    
    if (selected.includes(selection)) {
      setSelected((prevState) => prevState.filter((item) => item !== selection));
      setGroup((prevState) => {
        const newData = prevState.data.filter((item: any) => item.name !== selection);
        return { data: newData };
      });
      setnewUserDetails((prevState) => prevState.filter((item: any) => item.name !== selection));
    } else {
      setSelected((prevState) => [...prevState, selection]);
    }
  };
  const onToggleAccordian = (id: string) => {
    setExpanded(id === expanded ? '' : id);
  };

  const handleChange = (checked: boolean, event: React.FormEvent<HTMLInputElement>, name: string, email: string, key: string) => {
    const temp = [...group.data];
    const index = temp.findIndex((e: RoverGropListItem) => e.email === email);
    
    if (index >= 0) {
      temp[index] = { ...temp[index], [key]: checked };
      setGroup({ data: temp });
    }
  };

  const onToggleAccess = (isOpenAccess: boolean, email: string) => {
    setIsOpenAccess(isOpenAccess);
    setnewUserDetails(prevDetails => {
      const temp = [...prevDetails];
      const index = temp.findIndex(m => m.email === email);
      if (index >= 0) {
        temp[index] = { ...temp[index], isOpen: isOpenAccess };
      }
      return temp;
    });
  };

  const onSelectAccess = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string,
    // isPlaceholder: boolean,
    email: string
  ) => {
    setIsOpenAccess(false);
    setnewUserDetails(prevDetails => {
      const temp = [...prevDetails];
      const index = temp.findIndex(m => m.email === email);
      if (index >= 0) {
        temp[index] = { ...temp[index], isOpen: false, role: selection };
      }
      return temp;
    });
  };

  const handleAddMemberClick = (event: React.MouseEvent | React.ChangeEvent, option: any) => {
    setnewUserDetails(prevDetails => {
      const temp = [...prevDetails];
      const check = temp.find(key => key.name === option.name);
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
      .filter(v => v.email)
      .map(v => {
        const tempActions: string[] = Object.keys(v).filter(a => v[a] && a !== 'name' && a !== 'email' && a !== 'role');
        return { name: v.name, email: v.email, actions: tempActions };
      });
    addData.permissionDetails = addPerm;
    try {
      await useAddPermission1.mutateAsync(addData as any).then(() => {
        toast.success('Members added successfully');
      })
      onClose();
    } catch (error) {
     
    }
  };

  const onToggleRover = (isOpenR: boolean) => {
    
  };

  const onSelectRover: SelectProps['onSelect'] = (event, selection) => {
    
    setSelectedRover(prevState => {
      if (prevState.includes(selection)) {
        return prevState.filter(item => item !== selection);
      } else {
        return [...prevState, selection];
      }
    });

    setGroup(prevGroup => ({
      data: prevGroup.data.filter(n => n.name !== selection)
    }));
  };
  const clearSelection = () => {
    if (activeTabKey === 0) {
      setSelected([]);
      setGroup({ data: {} });
      setnewUserDetails([]);
      setIsOpen(false);
    }
    else {
      setSelectedRover([]);
      setGroup({ data: {} })
      setUserList([])
      
    }
  };
  const addRoleToRoverGroup = (roverGroupList: any) => {

    if (roverGroupList) {
      const updatedRoverGroupList = roverGroupList.map(item => ({
        ...item,
        role: 'User',
        isOpen: false
      }));
      setRoverList(updatedRoverGroupList);
    } else {
      toast.error('Please enter a valid Rover Group Common Name (cn)');
    }
  };
  const debounceCustomCombined = (delay: number, selectedTab: string | number): SelectProps['onFilter'] => {
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
      return;
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
        title={<TabTitleText><UserIcon /> Email</TabTitleText>}
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
            {(userList || []).map((option, index) => (
              <SelectOption
                key={index}
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
              <Thead noWrap={true}>
                <Tr>
                  <Th>{columnNames2.NAME}</Th>
                  {Object.keys(columnNames2).map((key) => {
                    if (key === 'NAME') {
                      return null;
                    }
                    return <Th key={key}>{toPascalCase(columnNames2[key])}</Th>;
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(group).length &&
                  group.data.map((i: GroupItem1) => (

                    <Tr key={i.name}>
                      <Td>{i.name}</Td>
                      {Object.keys(columnNames2).map((key) => {
                        if (key === 'NAME' || key === 'ROLE') {
                          return null;
                        }
                        const isChecked = i[key];
                        return (
                          <Td key={key}>
                            <Checkbox
                              isChecked={isChecked}
                              onChange={(checked, e) => handleChange(checked, e, i.name, i.email, key)}
                              id={key}
                              name={key}
                            />
                          </Td>
                        );
                      })}
                    </Tr>
                  ))}
              </Tbody>
            </TableComposable>
          ) : (
            <>
              <Accordion asDefinitionList>
                {newUserDetails.map((user) => {
                  const { email, name, role, isOpen } = user;
                  const isExpanded = expanded === `def-list-toggle1_${email}`;
                  const onToggleAccessHandler = () => onToggleAccess(!isOpen, email);
                  const onSelectAccessHandler = (event, selection) =>
                    onSelectAccess(event, selection, email);

                  return (
                    <AccordionItem key={email}>
                      <AccordionToggle
                        id={`def-list-toggle1_${email}`}
                        isExpanded={isExpanded}
                        onClick={() => onToggleAccordian(`def-list-toggle1_${email}`)}
                      >
                        <Split>
                          <SplitItem isFilled onClick={(e) => e.stopPropagation()}>
                            {name}
                            <br />
                            {email}
                          </SplitItem>
                          <SplitItem isFilled></SplitItem>
                          <SplitItem onClick={(e) => e.stopPropagation()}>
                            <Select
                              id={`access_${email}`}
                              variant={SelectVariant.single}
                              placeholderText="Access"
                              aria-label="Access"
                              onToggle={onToggleAccessHandler}
                              onSelect={onSelectAccessHandler}
                              selections={role}
                              isOpen={isOpen}
                              menuAppendTo={() => document.body}
                              isPlain={true}
                            >
                              <SelectOption key={`user_${email}`} value="User">
                                User
                              </SelectOption>
                              <SelectOption key={`owner_${email}`} value="Owner">
                                Owner
                              </SelectOption>
                            </Select>
                          </SplitItem>
                        </Split>
                      </AccordionToggle>
                      <AccordionContent
                        id={`def-list-expand1${email}`}
                        isHidden={!isExpanded}
                      >
                        <TableComposable>
                          <Thead noWrap={true}>
                            <Tr>
                              {Object.values(columnNames2).map((columnName) => (
                                <Th key={columnName}>{toPascalCase(columnName)}</Th>
                              ))}
                            </Tr>
                          </Thead>
                          <Tbody>
                            {group.data
                              .filter((item) => item.name === name)
                              .map((item) => (
                                <Tr key={item.name}>
                                  <Td>{item.name}</Td>
                                  {Object.keys(columnNames2).map((columnName) => (
                                    <Td key={columnName}>


                                      <Checkbox
                                        isChecked={item[columnName]}
                                        onChange={(checked, event) =>
                                          handleChange(checked, event, name, email, columnName)
                                        }
                                        id={columnName}
                                        name={columnName}
                                      />
                                    </Td>
                                  ))}
                                </Tr>
                              ))}
                          </Tbody>
                        </TableComposable>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

            </>)
          }
          <Button isDisabled={Object.keys(group).length && group?.data.length === 0} variant="primary" onClick={handleSubmit}>

            Add Members
          </Button>
        </div>

      </Tab>
      <Tab
        eventKey={1}

        title={<TabTitleText><UsersIcon /> Rover Group</TabTitleText>}

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
            {(roverList || []).map((option, index) => (
              <SelectOption
                key={index}
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
              <Thead noWrap={true}>
                <Tr>
                  <Th>{toPascalCase(columnNames2.NAME)}</Th>
                  <Th>{toPascalCase(columnNames2.APIKEY_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames2.APIKEY_DELETION)}</Th>
                  <Th>{toPascalCase(columnNames2.PERMISSION_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames2.PERMISSION_DELETION)}</Th>
                  <Th>{toPascalCase(columnNames2.ENV_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames2.ENV_SYNC)}</Th>

                </Tr>
              </Thead>

              <Tbody>
                {Object.keys(group).length && group.data.map((i: GroupItem1) => (
                  <Tr key={i.name}>
                    <Td>{i.name}</Td>
                    {[i.APIKEY_CREATION, i.APIKEY_DELETION, i.PERMISSION_CREATION, i.PERMISSION_DELETION, i.ENV_CREATION, i.ENV_SYNC].map((isChecked, index) => (
                      <Td key={index}>
                        <Checkbox
                          isChecked={isChecked}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email, `${columnNames2[Object.keys(columnNames2)[index + 1]]}`)}
                          id={`${columnNames2[Object.keys(columnNames2)[index + 1]]}`}
                          name={`${columnNames2[Object.keys(columnNames2)[index + 1]]}`}
                        />
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </TableComposable>
          )
            : (
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

                          <SplitItem isFilled></SplitItem>
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
                          <Thead noWrap={true}>
                            <Tr>
                              <Th>{columnNames2.NAME}</Th>
                              <Th>{toPascalCase(columnNames2.APIKEY_CREATION)}</Th>
                              <Th>{toPascalCase(columnNames2.APIKEY_DELETION)}</Th>
                              <Th>{toPascalCase(columnNames2.PERMISSION_CREATION)}</Th>
                              <Th>{toPascalCase(columnNames2.PERMISSION_DELETION)}</Th>
                              <Th>{toPascalCase(columnNames2.ENV_CREATION)}</Th>
                              <Th>{toPascalCase(columnNames2.ENV_SYNC)}</Th>

                            </Tr>
                          </Thead>


                          <Tbody>
                            {Object.keys(group).length && Object.keys(group.data).length && group.data.map((i: GroupItem1) => (
                              <Tr key={i.name}>
                                <Td>{i.name}</Td>

                                {[i.APIKEY_CREATION, i.APIKEY_DELETION, i.PERMISSION_CREATION, i.PERMISSION_DELETION, i.ENV_CREATION, i.ENV_SYNC].map((isChecked, index) => (
                                  <Td key={index}>
                                    <Checkbox
                                      isChecked={isChecked}
                                      onChange={(checked, e) => handleChange(checked, e, i.name, i.email, `${columnNames2[Object.keys(columnNames2)[index + 1]]}`)}
                                      id={`${columnNames2[Object.keys(columnNames2)[index + 1]]}`}
                                      name={`${columnNames2[Object.keys(columnNames2)[index + 1]]}`}
                                    />
                                  </Td>
                                ))}
                              </Tr>
                            ))}
                          </Tbody>
                        </TableComposable>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}


          <Button isDisabled={Object.keys(group).length && group?.data.length === 0} variant="primary" onClick={handleSubmit}>

            Add Members
          </Button>
        </div>

      </Tab>
    </Tabs>
  );
};