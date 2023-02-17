/* eslint-disable */
import React, { useState } from 'react';
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
import toast from 'react-hot-toast';

interface Props {
  onClose?: () => void;
  editMemberName: string;
  propertyIdentifier: string;
  memberList: any;
}

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

export const EditMemberAccess = ({
  onClose,
  editMemberName,
  propertyIdentifier,
  memberList
}: Props): JSX.Element => {
  const [expanded, setExpanded] = useState('def-list-toggle2');
  const [addAccess, setAddAccess] = useState<string[]>([]);
  const [deleteAccess, setDeleteAccess] = useState<string[]>([]);
  const useAddPermission1 = useAddPermission(propertyIdentifier);
  const deleteMember = useDeleteMember(propertyIdentifier);
  const data1 = memberList.data.filter((e: any) => e.name === editMemberName);
  const [group, setGroup] = useState({ data: data1 });

  const columnNames = {
    NAME: 'Name',
    // ROLE: 'Role',
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
    email: string
  ) => {
    const target: any = event.currentTarget;
    const temp = group.data;
    const objIndex = temp.findIndex((e: any) => e.email === email);
    temp[objIndex][target.name] = checked;
    setGroup({ data: temp });

    if (checked) {
      setAddAccess([...addAccess, target.name]);
      setDeleteAccess(deleteAccess.filter((value) => value !== target.name));
    } else {
      setDeleteAccess([...deleteAccess, target.name]);
      setAddAccess(addAccess.filter((value) => value !== target.name));
    }
  };

  const handleSubmit = () => {
    const addPerm = group.data.map(({ email, name, role, ...rand }) => ({
      email,
      name,
      actions: Object.keys(rand)
    }));

    const addData = { propertyIdentifier, permissionDetails: addPerm };

    const deletePerm = group.data.map(({ email, name, role, ...rand }) => ({
      email,
      name,
      actions: Object.keys(rand).filter((value) => rand[value] === false)
    }));

    const deleteData = { propertyIdentifier, permissionDetails: deletePerm };

    try {
      if (addAccess.length) {
        useAddPermission1
          .mutateAsync({
            ...addData
          })
          .then((res) => {
            toast.success('Permission updated successfully');
            return res;
          });
      }

      if (deleteAccess.length) {
        deleteMember
          .mutateAsync({
            ...deleteData
          })
          .then(() => {
            toast.success('Permission updated successfully');
          });
      }

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Accordion asDefinitionList>
        <AccordionItem>
          <AccordionToggle
            style={{ width: '100%' }}
            onClick={() => {
              onToggleAccordian(`def-list-toggle1_${editMemberName}`);
            }}
            isExpanded={expanded === `def-list-toggle1_${editMemberName}`}
            id="def-list-toggle1_"
          >
            <Split>
              <SplitItem style={{ display: 'flex', justifyContent: 'start' }} isFilled>
                {editMemberName}
              </SplitItem>
              <SplitItem style={{ display: 'flex', justifyContent: 'end' }} isFilled>
                {toPascalCase(group.data[0].role)}
              </SplitItem>
            </Split>
          </AccordionToggle>

          <AccordionContent
            id={`def-list-expand1${editMemberName}`}
            isHidden={expanded !== `def-list-toggle1_${editMemberName}`}
          >
            <TableComposable>
              <Thead noWrap>
                <Tr>
                  <Th>{columnNames.NAME}</Th>
                  <Th>{toPascalCase(columnNames.APIKEY_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames.APIKEY_DELETION)}</Th>
                  <Th>{toPascalCase(columnNames.PERMISSION_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames.PERMISSION_DELETION)}</Th>
                  <Th>{toPascalCase(columnNames.ENV_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames.ENV_SYNC)}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(group).length &&
                  group.data.map((i: GroupItem1) => (
                    <Tr key={i.name}>
                      <Td>{i.name}</Td>
                      {[
                        i.APIKEY_CREATION,
                        i.APIKEY_DELETION,
                        i.PERMISSION_CREATION,
                        i.PERMISSION_DELETION,
                        i.ENV_CREATION,
                        i.ENV_SYNC
                      ].map((isChecked, index) => (
                        <Td key={index}>
                          <Checkbox
                            isChecked={isChecked}
                            onChange={(checked, e) => handleChange(checked, e, i.email)}
                            id={`${columnNames[Object.keys(columnNames)[index + 1]]}`}
                            name={`${columnNames[Object.keys(columnNames)[index + 1]]}`}
                          />
                        </Td>
                      ))}
                    </Tr>
                  ))}
              </Tbody>
            </TableComposable>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};