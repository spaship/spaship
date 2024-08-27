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
import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';

type ColumnNames = {
  NAME: string;
  [key: string]: string;
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
  APPLICATION_CREATION: boolean;
  PROPERTY_CMDB_UPDATE: boolean;
  [key: string]: boolean | string;
};
type UserDataDTO = {
  data: GroupItem1[];
};
type GroupData = {
  email: string;
  name: string;
  role: string;
  [key: string]: unknown;
};
type Props = {
  onClose: () => void;
  editMemberName: string;
  propertyIdentifier: string;
  memberList: UserDataDTO;
};

const columnNames: ColumnNames = {
  NAME: 'Name',
  APIKEY_CREATION: 'APIKEY_CREATION',
  APIKEY_DELETION: 'APIKEY_DELETION',
  PERMISSION_CREATION: 'PERMISSION_CREATION',
  PERMISSION_DELETION: 'PERMISSION_DELETION',
  ENV_CREATION: 'ENV_CREATION',
  ENV_SYNC: 'ENV_SYNC',
  APPLICATION_CREATION: 'APPLICATION_CREATION',
  PROPERTY_CMDB_UPDATE: 'PROPERTY_CMDB_UPDATE'
};
// TODO(akhilmhdh): Migrate to react-hook-form later. Removes a lot of boilerplate in this page
export const EditMemberAccess = ({
  onClose,
  editMemberName,
  propertyIdentifier,
  memberList
}: Props): JSX.Element => {
  const [expanded, setExpanded] = useState('def-list-toggle2');
  const [addAccess, setAddAccess] = useState<string[]>([]);
  const [deleteAccess, setDeleteAccess] = useState<string[]>([]);
  const addPermission = useAddPermission(propertyIdentifier);
  const deleteMember = useDeleteMember(propertyIdentifier);
  const [group, setGroup] = useState(memberList);
  const onToggleAccordian = async (id: string) => {
    if (id === expanded) {
      setExpanded('');
    } else {
      setExpanded(id);
    }
  };
  const handleChange = (checked: boolean, event: FormEvent<HTMLInputElement>, email: string) => {
    const target = event.currentTarget as HTMLInputElement;
    setGroup(({ data }) => ({
      data: data.map((e) => (email === e.email ? { ...e, [target.name]: checked } : e))
    }));
    if (checked) {
      setAddAccess([...addAccess, target.name]);
      setDeleteAccess(deleteAccess.filter((value) => value !== target.name));
    } else {
      setDeleteAccess([...deleteAccess, target.name]);
      setAddAccess(addAccess.filter((value) => value !== target.name));
    }
  };

  const handleSubmit = () => {
    const addPerm = group.data.map(({ email, name, role, ...rand }: GroupData) => ({
      email,
      name,
      actions: Object.keys(rand)
    }));
    const addData = { propertyIdentifier, permissionDetails: addPerm };
    const deletePerm = group.data.map(({ email, name, role, ...rand }: GroupData) => ({
      email,
      name,
      actions: Object.keys(rand).filter((value) => rand[value] === false)
    }));
    const deleteData = { propertyIdentifier, permissionDetails: deletePerm };
    // TODO(akhilmhdh):I can see that there is toast error inside the hook for 403 but what about other errors that could happen like 500 internal server error.
    // How about adding a default error message too if specific ones fail

    if (addAccess.length) {
      addPermission
        .mutateAsync({
          ...addData
        })
        .then(() => {
          toast.success('Permission updated successfully');
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
              {/* TODO(akhilmhdh): store all column names in one place east to edit */}
              <Thead noWrap>
                <Tr>
                  <Th>{columnNames.NAME}</Th>
                  <Th>{toPascalCase(columnNames.APIKEY_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames.APIKEY_DELETION)}</Th>
                  <Th>{toPascalCase(columnNames.PERMISSION_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames.PERMISSION_DELETION)}</Th>
                  <Th>{toPascalCase(columnNames.ENV_CREATION)}</Th>
                  <Th>{toPascalCase(columnNames.ENV_SYNC)}</Th>
                  <Th>{toPascalCase(columnNames.APPLICATION_CREATION)}</Th>
                  <Th>CMDB Update (Property)</Th>
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
                        { id: 'ENV_SYNC', value: i.ENV_SYNC },
                        { id: 'APPLICATION_CREATION', value: i.APPLICATION_CREATION },
                        { id: 'PROPERTY_CMDB_UPDATE', value: i.PROPERTY_CMDB_UPDATE }
                      ].map((item) => (
                        <Td key={item.id}>
                          <Checkbox
                            isChecked={item.value}
                            onChange={(checked, e) => handleChange(checked, e, i.email)}
                            id={`${columnNames[item.id]}`}
                            name={`${columnNames[item.id]}`}
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
      <Button className="pf-u-mt-md" variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};
