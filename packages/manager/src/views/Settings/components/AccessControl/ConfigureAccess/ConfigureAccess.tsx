/* eslint-disable no-underscore-dangle */
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
import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { AddDataType, DeleteDataType, GroupDTO, GroupItem } from './types';

type Props = {
  onClose: () => void;
  propertyIdentifier: string;
  memberList: any;
  flagOpen: boolean;
};
const columnNames = {
  NAME: 'Name',
  APIKEY_CREATION: 'APIKEY_CREATION',
  APIKEY_DELETION: 'APIKEY_DELETION',
  PERMISSION_CREATION: 'PERMISSION_CREATION',
  PERMISSION_DELETION: 'PERMISSION_DELETION',
  ENV_CREATION: 'ENV_CREATION',
  ENV_SYNC: 'ENV_SYNC',
  APPLICATION_CREATION: 'APPLICATION_CREATION'
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
  // TODO(akhilmhdh) : Same opinion on group. Why keep this as object if only one key
  const [group, setGroup] = useState<GroupDTO>({ data: memberList?.data });

  useEffect(() => {
    setGroup(memberList);
  }, [flagOpen, memberList]);
  const deleteMember = useDeleteMember(propertyIdentifier);
  const addPermission = useAddPermission(propertyIdentifier);

  const handleChange = (
    checked: boolean,
    event: FormEvent<HTMLInputElement>,
    name: string,
    email: string
  ) => {
    const target = event.currentTarget;
    const addAccess1 = [...addAccess];
    const deleteAccess1 = [...deleteAccess];
    setGroup(({ data }) => ({
      data: data.map((e) => (email === e.email ? { ...e, [target.name]: checked } : e))
    }));

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
  const handleSubmit = () => {
    const addData: AddDataType = {
      propertyIdentifier,
      permissionDetails: group.data.map(({ email, name, ...rand }) => ({
        email,
        name,
        actions: Object.keys(rand).filter((key) => rand[key] === true)
      }))
    };
    const deleteData: DeleteDataType = {
      propertyIdentifier,
      permissionDetails: group.data
        .map(({ email, name, ...rand }) => ({
          email,
          name,
          actions: Object.keys(rand).filter((key) => rand[key] === false)
        }))
        .filter(({ actions }: { actions: string[] }) => actions.length > 0)
    };

    if (addAccess.length || deleteAccess.length) {
      addPermission.mutateAsync(addData).then((res) => {
        toast.success('Permission updated successfully');
        return res;
      });

      deleteMember.mutateAsync(deleteData).then((res) => {
        toast.success('Permission updated successfully');
        return res;
      });
    }
    onClose();
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
        {!isShowAdvancedViewEnabled ? 'Show Detailed Permissions' : 'Hide Detailed Permissions'}
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
                  <Td>
                    <Checkbox
                      isChecked={i.APPLICATION_CREATION}
                      onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                      id="APPLICATION_CREATION"
                      name="APPLICATION_CREATION"
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
                <AccordionItem key={i.name}>
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
                          <Td>
                            <Checkbox
                              isChecked={i.APPLICATION_CREATION}
                              onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                              id="APPLICATION_CREATION"
                              name="APPLICATION_CREATION"
                            />
                          </Td>
                        </Tr>
                      </Tbody>
                    </TableComposable>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      )}
      <Button variant="primary" onClick={handleSubmit} className="pf-u-mt-md">
        Configure Access
      </Button>
    </div>
  );
};
