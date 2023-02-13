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
  TabTitleText,
  Spinner,
  Label
} from '@patternfly/react-core';
import { Table, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { toPascalCase } from '@app/utils/toPascalConvert';

import { UserIcon, UsersIcon, InfoCircleIcon, IntegrationIconConfig } from '@patternfly/react-icons';

export const schema = yup.object({
  // TODO: change this to URL validation, after server supports http protocol append
  url: yup.string().label('Hostname URL').trim().required().max(250),
  env: yup
    .string()
    .label('Environment Name')
    .noWhitespace()
    .trim()
    .max(50)
    .alphabetsOnly()
    .required(),
  cluster: yup.string().label('Environment Type').oneOf(['preprod', 'prod']).required()
});
export interface FormData extends yup.InferType<typeof schema> { }

// interface GroupChild {
//   name: string;
//   email: string;
// }
// interface GroupType {
//   data: GroupChild[];
// }
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

type NewUserItem = {
  name: string;
  email: string;
  role: string;
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
  const [isOpenRover, setIsOpenRover] = React.useState(false);
  const [selectedRover, setSelectedRover] = React.useState<any[]>([]);
  const [roverList, setRoverList] = React.useState<any[]>([]);
  const propertyIdentifier = query.propertyIdentifier as string;

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };
  // const onChange = (value: string) => {
  //   setValue(value);
  // };

  // const individualRole = {
  //   data: [
  //     {
  //       email: 'nmore@redhat.com',
  //       name: 'Nikhita More',
  //       role: 'OWNER',
  //       PERMISSION_CREATION: true,
  //       PERMISSION_DELETION: true,
  //       ENV_SYNC: true,
  //       ENV_CREATION: true,
  //       APIKEY_DELETION: true,
  //       APIKEY_CREATION: true
  //     },
  //     {
  //       email: 'souchowd@redhat.com',
  //       name: 'Soumyadip Chowdhury',
  //       role: 'OWNER',
  //       PERMISSION_DELETION: true,
  //       PERMISSION_CREATION: true
  //     },
  //     {
  //       email: 'test@redhat.com',
  //       name: 'Arko',
  //       role: 'OWNER',
  //       PERMISSION_CREATION: true,
  //       PERMISSION_DELETION: true,
  //       APIKEY_DELETION: true,
  //       APIKEY_CREATION: true
  //     }
  //   ],
  //   isArray: true,
  //   path: '/api/v1/permission',
  //   duration: '16ms',
  //   method: 'GET'
  // };
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
    if (activeTabKey === 0) {
      const data: string[] = [];
      let temp: any = {};

      newUserDetails.length !== 0 &&
        newUserDetails.map((v: NewUserItem, k: number) => {
          temp = {};
          temp.name = v.name;
          temp.email = v.email;

          role[v.role].map((optionKey: string) => {
            temp[optionKey] = true;
          });
          data.push(temp);
        });
      setGroup({ data });
    } else {
      const data: string[] = [];
      let temp: any = {};
      roverList.length !== 0 &&
        roverList.map((v: any, k: number) => {
          temp = {};
          temp.name = v.name;
          temp.email = v.email;
          role[v.role].map((optionKey: string) => {
            temp[optionKey] = true;
          });
          data.push(temp);
        });

      setGroup({ data });
    }
  }, [JSON.stringify(newUserDetails), selected, roverList]);

  const onToggle = (isOpen: boolean) => {
    userList.length && setIsOpen(isOpen);
  };
  const onSelect: SelectProps['onSelect'] = (event, selection) => {
    let temp = group
    if (selected.includes(selection)) {

      setSelected((prevState) => prevState.filter((item) => item !== selection));
      setGroup({ data: group.data.filter((n: GroupItem1) => n.name !== selection) });
      setnewUserDetails(newUserDetails.filter((n) => n.name !== selection));


    } else {

      setSelected((prevState) => [...prevState, selection]);
      // setnewUserDetails(newUserDetails.filter((n) => n.name !== selection));

      // let c = newUserDetails.filter((value, index, self) =>
      //   index === self.findIndex((t) => (
      //     t.email === value.email && t.name === value.name
      //   ))
      // )

    }
  };
  const clearSelection = () => {
    setSelected([]);
    setGroup({ data: {} });
    setnewUserDetails([]);
    setIsOpen(false);
  };

  const columnNames2 = {
    NAME: 'Name',
    ROLE: 'Role',
    APIKEY_CREATION: 'APIKEY_CREATION',
    APIKEY_DELETION: 'APIKEY_DELETION',
    PERMISSION_CREATION: 'PERMISSION_CREATION',
    PERMISSION_DELETION: 'PERMISSION_DELETION',
    ENV_CREATION: 'ENV_CREATION',
    ENV_SYNC: 'ENV_SYNC'
  };
  const onToggleAccordian = async (id: string) => {
    if (id === expanded) {
      setExpanded('');
    } else {
      setExpanded(id);
    }
  };
  const handleChange = (
    checked: boolean,
    event: React.FormEvent<HTMLInputElement>,
    name: string,
    email: string
  ) => {
    const target = event.currentTarget;
    const temp = group.data;

    temp.filter((e: RoverGropListItem) => e.email === email)[0][target.name] = checked;
    setGroup({ data: temp });
  };

  const debounceCustom = (delay: number): SelectProps['onFilter'] => {
    let timer: any;

    return (
      e: React.ChangeEvent<HTMLInputElement> | null,
      value: string
    ): React.ReactElement[] | undefined => {
      clearInterval(timer);
      timer = setTimeout(async () => {
        if (value.length >= 3) {
          const res = await fetchUserlist(value)
          await setUserList(res);
          setIsOpen(true)
        }
      }, delay);
      return
    };
  };

  const onToggleAccess = (isOpenAccess: boolean, email: string) => {

    setIsOpenAccess(isOpenAccess);
    const temp = newUserDetails;
    temp.filter((m) => m.email === email)[0].isOpen = isOpenAccess;

    setnewUserDetails(temp);
  };

  const onSelectAccess = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string,
    isPlaceholder: boolean,
    email: string
  ) => {
    setIsOpenAccess(false);

    const temp = newUserDetails;
    temp.filter((m) => m.email === email)[0].isOpen = false;
    temp.filter((m) => m.email === email)[0].role = selection;
    setnewUserDetails(temp);
  };

  const handleAddMemberClick = (event: React.MouseEvent | React.ChangeEvent, option: any) => {
    const temp = newUserDetails;
    option.role = 'User';
    option.isOpen = false;
    const check = temp.find(key => key.name == option.name)
    if (!check) {
      temp.push(option);
    }



    setnewUserDetails(temp);
  };

  const useAddPermission1 = useAddPermission(propertyIdentifier);
  const handleSubmit = () => {
    const addData: Partial<AddDataType> = {};
    let addPerm: AddPermType = [];
    group.data.map((v: any) => {
      const temp: any = {};
      const tempActions: string[] = [];
      temp.name = v.name;
      temp.email = v.email;
      Object.keys(v).map((a: string) => {
        v[a] && a !== 'name' && a !== 'email' && a !== 'role' && tempActions.push(a);
      });
      temp.actions = tempActions;
      addPerm = [...addPerm, temp];
    });
    addData.propertyIdentifier = propertyIdentifier;
    addData.permissionDetails = addPerm;
    try {
      let flag = false
      useAddPermission1.mutateAsync({
        ...addData as any
      }).then(()=>{
       toast.success('Members added successfully');
      });
      onClose()
   
    } 
    catch (error) {
      // toast.error('Members not added ');
    }
  };
  // .catch(() => {
  //   toast.error('Members not added successfully');

  //   });
  const onToggleRover = (isOpenR: boolean) => {
    // setIsOpenRover(isOpenR);

  };

  const onSelectRover: SelectProps['onSelect'] = (event, selection) => {
    if (selectedRover.includes(selection)) {
      setSelectedRover((prevState) => prevState.filter((item) => item !== selection));
      setGroup({ data: group.data.filter((n: RoverGropListItem) => n.name !== selection) });
    } else {
      setSelectedRover((prevState) => [...prevState, selection]);
    }
  };

  const clearSelectionRover = () => {
    setSelectedRover([]);
    setIsOpenRover(false);
  };

  const addRoletoroverGroup = (roverGroupList: any) => {
    if (roverGroupList !== undefined) {
      roverGroupList.map((item: RoverGropListItem) => {
        item.role = 'User';
        item.isOpen = false;
      });
      setRoverList(roverGroupList);
    }
    else {
      toast.error("Please enter a valid Rover Group Common Name (cn)")
    }
  };
  const debounceCustomRover = (delay: number): SelectProps['onFilter'] => {
    let timer: any;

    return (
      e: React.ChangeEvent<HTMLInputElement> | null,
      value: string
    ): React.ReactElement[] | undefined => {
      clearInterval(timer);

      timer = setTimeout(async () => {
        if (value.length >= 3) {
          const res = await fetchRoverGroup(value)
          await addRoletoroverGroup(res);
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
            onFilter={debounceCustom(500)}
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
                  {/* <Th>{columnNames2.ROLE}</Th> */}
                  <Th>{toPascalCase(columnNames2.APIKEY_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames2.APIKEY_DELETION)}</Th>
                  <Th>{toPascalCase(columnNames2.PERMISSION_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames2.PERMISSION_DELETION)}</Th>
                  <Th>{toPascalCase(columnNames2.ENV_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames2.ENV_SYNC)}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(group).length &&
                  group.data.map((i: GroupItem1) => (
                    <Tr key={i.name}>
                      <Td>{i.name}</Td>
                      <Td>
                        <Checkbox
                          isChecked={i.APIKEY_CREATION}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="APIKEY_CREATION"
                          name="APIKEY_CREATION"
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          isChecked={i.APIKEY_DELETION}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="APIKEY_DELETION"
                          name="APIKEY_DELETION"
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          isChecked={i.PERMISSION_CREATION}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="PERMISSION_CREATION"
                          name="PERMISSION_CREATION"
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          isChecked={i.PERMISSION_DELETION}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="PERMISSION_DELETION"
                          name="PERMISSION_DELETION"
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          isChecked={i.ENV_CREATION}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="ENV_CREATION"
                          name="ENV_CREATION"
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          isChecked={i.ENV_SYNC}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="ENV_SYNC"
                          name="ENV_SYNC"
                        />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </TableComposable>
          ) : (
            <div>
              <Accordion asDefinitionList>
                {newUserDetails.map((v, k) => (
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
                        <SplitItem isFilled></SplitItem>
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
                            isPlain={true}
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
                        <Thead noWrap={true}>
                          <Tr>
                            <Th>{toPascalCase(columnNames2.NAME)}</Th>
                            {/* <toPascalCase(Th>{columnNames2.ROLE}</T)h> */}
                            <Th>{toPascalCase(columnNames2.APIKEY_CREATION)}</Th>
                            <Th>{toPascalCase(columnNames2.APIKEY_DELETION)}</Th>
                            <Th>{toPascalCase(columnNames2.PERMISSION_CREATION)}</Th>
                            <Th>{toPascalCase(columnNames2.PERMISSION_DELETION)}</Th>
                            <Th>{toPascalCase(columnNames2.ENV_CREATION)}</Th>
                            <Th>{toPascalCase(columnNames2.ENV_SYNC)}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {Object.keys(group).length &&
                            group.data.map(
                              (i: GroupItem1) =>
                                i.name == v.name && (
                                  <Tr key={i.name}>
                                    <Td>{i.name}</Td>

                                    <Td>
                                      <Checkbox
                                        isChecked={i.APIKEY_CREATION}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="APIKEY_CREATION"
                                        name="APIKEY_CREATION"
                                      />
                                    </Td>
                                    <Td>
                                      <Checkbox
                                        isChecked={i.APIKEY_DELETION}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="APIKEY_DELETION"
                                        name="APIKEY_DELETION"
                                      />
                                    </Td>
                                    <Td>
                                      <Checkbox
                                        isChecked={i.PERMISSION_CREATION}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="PERMISSION_CREATION"
                                        name="PERMISSION_CREATION"
                                      />
                                    </Td>
                                    <Td>
                                      <Checkbox
                                        isChecked={i.PERMISSION_DELETION}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="PERMISSION_DELETION"
                                        name="PERMISSION_DELETION"
                                      />
                                    </Td>
                                    <Td>
                                      <Checkbox
                                        isChecked={i.ENV_CREATION}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="ENV_CREATION"
                                        name="ENV_CREATION"
                                      />
                                    </Td>
                                    <Td>
                                      <Checkbox
                                        isChecked={i.ENV_SYNC}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="ENV_SYNC"
                                        name="ENV_SYNC"
                                      />
                                    </Td>
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
          <Button isDisabled={selected.length === 0} variant="primary" onClick={handleSubmit}>

            Add Members
          </Button>
        </div>

        {/* <RbacForm title={"Email"} placeholderText={"Kindly enter email"} keyprops={'addMember'}  selected1={[]} isShowAdvancedViewEnabledprops ={false} data ={[]} propertyIdentifier={propertyIdentifier}/> */}
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
            onFilter={debounceCustomRover(1000)}
            onToggle={onToggleRover}
            onSelect={onSelectRover}
            onClear={clearSelectionRover}
            // selections={selected}
            // isOpen={isOpenRover}

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
                {Object.keys(group).length &&
                  group.data.map((i: GroupItem1) => (
                    <Tr key={i.name}>
                      <Td>{i.name}</Td>
                      <Td>
                        <Checkbox
                          isChecked={i.APIKEY_CREATION}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="APIKEY_CREATION"
                          name="APIKEY_CREATION"
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          isChecked={i.APIKEY_DELETION}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="APIKEY_DELETION"
                          name="APIKEY_DELETION"
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          isChecked={i.PERMISSION_CREATION}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="PERMISSION_CREATION"
                          name="PERMISSION_CREATION"
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          isChecked={i.PERMISSION_DELETION}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="PERMISSION_DELETION"
                          name="PERMISSION_DELETION"
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          isChecked={i.ENV_CREATION}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="ENV_CREATION"
                          name="ENV_CREATION"
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          isChecked={i.ENV_SYNC}
                          onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                          id="ENV_SYNC"
                          name="ENV_SYNC"
                        />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </TableComposable>
          ) : (
            <div>
              <Accordion asDefinitionList>
                {(roverList || []).map((v, k) => (
                  <AccordionItem>
                    <AccordionToggle
                      onClick={() => {
                        onToggleAccordian(`def-list-toggle1_${v.email}`);
                      }}
                      isExpanded={expanded === `def-list-toggle1_${v.email}`}
                      id="def-list-toggle1_"
                    >
                      {/* <Table>
                        <Tbody>
                        <Tr>
                        <Td>  </Td>
                        <Td>{v.email}</Td>
                        <Td><b>{v.role}</b> </Td>
                        </Tr>
                        </Tbody>
                        
                       
                      </Table> */}
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
                            {/* <Th>{columnNames2.ROLE}</Th> */}

                            <Th>{toPascalCase(columnNames2.APIKEY_CREATION)}</Th>
                            <Th>{toPascalCase(columnNames2.APIKEY_DELETION)}</Th>
                            <Th>{toPascalCase(columnNames2.PERMISSION_CREATION)}</Th>
                            <Th>{toPascalCase(columnNames2.PERMISSION_DELETION)}</Th>
                            <Th>{toPascalCase(columnNames2.ENV_CREATION)}</Th>
                            <Th>{toPascalCase(columnNames2.ENV_SYNC)}</Th>

                          </Tr>
                        </Thead>
                        <Tbody>
                          {Object.keys(group).length &&
                            group.data.map(
                              (i: GroupItem1) =>
                                i.name === v.name && (
                                  <Tr key={i.name}>
                                    <Td>{i.name}</Td>

                                    <Td>
                                      <Checkbox
                                        isChecked={i.APIKEY_CREATION}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="APIKEY_CREATION"
                                        name="APIKEY_CREATION"
                                      />
                                    </Td>
                                    <Td>
                                      <Checkbox
                                        isChecked={i.APIKEY_DELETION}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="APIKEY_DELETION"
                                        name="APIKEY_DELETION"
                                      />
                                    </Td>
                                    <Td>
                                      <Checkbox
                                        isChecked={i.PERMISSION_CREATION}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="PERMISSION_CREATION"
                                        name="PERMISSION_CREATION"
                                      />
                                    </Td>
                                    <Td>
                                      <Checkbox
                                        isChecked={i.PERMISSION_DELETION}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="PERMISSION_DELETION"
                                        name="PERMISSION_DELETION"
                                      />
                                    </Td>
                                    <Td>
                                      <Checkbox
                                        isChecked={i.ENV_CREATION}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="ENV_CREATION"
                                        name="ENV_CREATION"
                                      />
                                    </Td>
                                    <Td>
                                      <Checkbox
                                        isChecked={i.ENV_SYNC}
                                        onChange={(checked, e) =>
                                          handleChange(checked, e, i.name, i.email)
                                        }
                                        id="ENV_SYNC"
                                        name="ENV_SYNC"
                                      />
                                    </Td>
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

          <Button isDisabled={Object.keys(group).length && group?.data.length === 0} variant="primary" onClick={handleSubmit}>

            Add Members
          </Button>
        </div>
        {/* <RbacForm title={"Rover Group or Name"} placeholderText={"Enter full rover group"} keyprops={'addMember'} selected1={[]} isShowAdvancedViewEnabledprops={false} data={[]} propertyIdentifier={propertyIdentifier} /> */}
      </Tab>
    </Tabs>
  );
};
