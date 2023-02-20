/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-key */
import { useAddPermission, useDeleteMember } from '@app/services/rbac';
import { toPascalCase } from '@app/utils/toPascalConvert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Button,
  Checkbox,
  Split,
  SplitItem
} from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type GroupItem = {
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
  onClose: () => void;
  propertyIdentifier: string;
  // memberList: GroupItem[];
  memberList: any;

  flagOpen: boolean;
};

export const ConfigureAccess = ({
  onClose,
  propertyIdentifier,
  memberList,
  flagOpen
}: Props): JSX.Element => {
  const [expanded, setExpanded] = useState<string>('def-list-toggle2');
  const [addAccess, setAddAccess] = useState<string[]>([]);
  const [deleteAccess, setDeleteAccess] = useState<string[]>([]);
  const [isShowAdvancedViewEnabled, setIsShowAdvancedViewEnabled] = useState<boolean>(false);
  const [group, setGroup] = useState<any>(memberList);

  // useEffect(() => {
  //   setGroup(memberList);
  // }, [flagOpen]);

  useEffect(() => {
    setGroup(memberList);
  }, [flagOpen, memberList]);

  const deleteMember = useDeleteMember(propertyIdentifier);
  const useAddPermission1 = useAddPermission(propertyIdentifier);
  const columnNames = {
    NAME: 'Name',
    ROLE: 'Role',
    APIKEY_CREATION: 'APIKEY_CREATION',
    APIKEY_DELETION: 'APIKEY_DELETION',
    PERMISSION_CREATION: 'PERMISSION_CREATION',
    PERMISSION_DELETION: 'PERMISSION_DELETION',
    ENV_CREATION: 'ENV_CREATION',
    ENV_SYNC: 'ENV_SYNC'
  };
  const handleChange = (
    checked: boolean,
    event: React.FormEvent<HTMLInputElement>,
    name: string,
    email: string
  ) => {
    const target = event.currentTarget;

    const temp = [...group.data];
    const addAccess1 = [...addAccess];
    const deleteAccess1 = [...deleteAccess];
    const index = temp.findIndex((e) => e.email === email);
    temp[index][target.name] = checked;
    setGroup({ data: temp });
    if (checked) {
      addAccess1.push(target.name);
      deleteAccess1.splice(deleteAccess1.indexOf(target.name), 1);
    } else {
      deleteAccess1.push(target.name);
      addAccess1.splice(addAccess1.indexOf(target.name), 1);
    }
    setAddAccess(addAccess1);
    setDeleteAccess(deleteAccess1);
  };

  const onToggleAccordian = async (id: string) => {
    if (id === expanded) {
      setExpanded('');
    } else {
      setExpanded(id);
    }
  };

  interface Permission {
    name: string;
    email: string;
    actions: string[];
  }
  const handleSubmit = () => {
    const addPerm: Permission[] = [];
    // let addflag = false;
    const deletePerm: Permission[] = [];
    // let deleteflag = false;

    group.data.forEach((v: any) => {
      const temp: any = {};
      const tempActions: string[] = [];

      const tempDelete: any = {};
      const tempActionsDelete: string[] = [];

      temp.name = v.name;
      temp.email = v.email;
      tempDelete.email = v.email;

      Object.keys(v).forEach((a: string) => {
        if (v[a] && a !== 'name' && a !== 'email' && a !== 'role') {
          tempActions.push(a);
        } else if (!v[a] && a !== 'name' && a !== 'email' && a !== 'role') {
          tempActionsDelete.push(a);
        }
      });

      // if (tempActions.length !== 0) {
      //   addflag = true;
      // }
      // if (tempActionsDelete.length !== 0) {
      //   deleteflag = true;
      // }

      temp.actions = tempActions;
      addPerm.push(temp);

      tempDelete.actions = tempActionsDelete;
      deletePerm.push(tempDelete);
    });

    const addData = {
      propertyIdentifier,
      permissionDetails: addPerm
    };
    const deleteData = {
      propertyIdentifier,
      permissionDetails: deletePerm
    };

    try {
      if (addAccess.length) {
        useAddPermission1.mutateAsync(addData).then((res) => {
          toast.success('Permission updated successfully');
          return res;
        });
      }
      if (deleteAccess.length) {
        deleteMember.mutateAsync(deleteData).then((res) => {
          toast.success('Permission updated successfully');
          return res;
        });
      }
      onClose();
    } catch (error) {
      // toast.error('Permission not deleted ');
    }
  };

  return (
    <div>
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
      {isShowAdvancedViewEnabled && Object.keys(columnNames).length ? (
        <TableComposable>
          <Thead noWrap>
            <Tr>
              {Object.values(columnNames).map((column) => (
                <Th key={column}>{toPascalCase(column)}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(group).length &&
              group.data.map((i: GroupItem) => (
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
            {Object.keys(group).length &&
              group.data.map((i: GroupItem) => (
                <AccordionItem>
                  <AccordionToggle
                    style={{ width: '100%' }}
                    onClick={() => {
                      onToggleAccordian(`def-list-toggle1_${i.name}`);
                    }}
                    isExpanded={expanded === `def-list-toggle1_${i.name}`}
                    id="def-list-toggle1_"
                  >
                    <Split>
                      <SplitItem style={{ display: 'flex', justifyContent: 'start' }} isFilled>
                        {i.name}
                      </SplitItem>
                      <SplitItem style={{ display: 'flex', justifyContent: 'end' }} isFilled>
                        {/* {group['data'][0]['role']} */}
                        {toPascalCase(i.role)}
                      </SplitItem>
                    </Split>
                  </AccordionToggle>
                  <AccordionContent
                    id={`def-list-expand1${i.name}`}
                    isHidden={expanded !== `def-list-toggle1_${i.name}`}
                  >
                    <TableComposable>
                      <Thead noWrap>
                        <Tr>
                          {Object.values(columnNames).map((column) => (
                            <Th key={column}>{toPascalCase(column)}</Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {/* {Object.keys(group).length && group['data'].map((i) => */}
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
                        {/* )} */}
                      </Tbody>
                    </TableComposable>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      )}
      <br />
      <Button variant="primary" onClick={handleSubmit}>
        Configure Access
      </Button>
    </div>
  );
};
