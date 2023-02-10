/* eslint-disable  */
import { useAddPermission, useDeleteMember } from '@app/services/rbac';
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
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { toPascalCase } from '@app/utils/toPascalConvert';
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

type AddPermType = {
  actions: [];
  email: string;
  name: string;
};

type AddDataType = {
  propertyIdentifier: string;
  permissionDetails: AddPermType;
};
type DeletePermType = {
  actions: [];
  email: string;
  name: string;
};

type DeleteDataType = {
  propertyIdentifier: string;
  permissionDetails: DeletePermType;
};

type Props = {
  // onSubmit: (data: FormData) => void;
  onClose: () => void;
  editMemberName: string;
  propertyIdentifier: string;
  memberList: any;
  flagOpen: boolean;
};

export const ConfigureAccess = ({
  onClose,
  editMemberName,
  propertyIdentifier,
  memberList,
  flagOpen
}: Props): JSX.Element => {
  const [expanded, setExpanded] = React.useState('def-list-toggle2');
  const [addAccess, setaddAccess] = React.useState([]);
  const [deleteAccess, setdeleteAccess] = React.useState([]);
  const [isShowAdvancedViewEnabled, setIsShowAdvancedViewEnabled] = React.useState(false);
  let memberCopy = new Object(memberList)


  const [group, setGroup] = React.useState<any>(memberList);
  const deleteMember = useDeleteMember(propertyIdentifier);


  useEffect(() => {
    // 
    setGroup(memberCopy)


  }, [flagOpen])



  const columnNames2 = {
    NAME: 'Name',
    ROLE: 'Role',
    APIKEY_CREATION: 'APIKEY CREATION',
    APIKEY_DELETION: 'APIKEY DELETION',
    PERMISSION_CREATION: 'PERMISSION CREATION',
    PERMISSION_DELETION: 'PERMISSION DELETION',
    ENV_CREATION: 'ENV CREATION',
    ENV_SYNC: 'ENV SYNC'
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

    temp.filter((e: GroupItem) => e.email === email)[0][target.name] = checked;
    setGroup({ data: temp });

  };

  const useAddPermission1 = useAddPermission(propertyIdentifier);
  const handleSubmit = () => {
    const addData: any = {};
    const addPerm: any = [];
    group.data.map((v: any, k: number) => {
      const temp: any = {};
      const tempActions: string[] = [];
      temp.name = v.name;
      temp.email = v.email;
      Object.keys(v).map((a: string, i: number) => {
        v[a] && a !== 'name' && a !== 'email' && a !== 'role' && tempActions.push(a);
      });
      temp.actions = tempActions;
      addPerm.push(temp);
    });
    addData.propertyIdentifier = propertyIdentifier;
    addData.permissionDetails = addPerm;
    // if (addPerm.length !== 0) {
    //   try {
    //     useAddPermission1.mutateAsync({
    //       ...addData
    //     });
    //     toast.success('Permission updated successfully');
    //   } catch (error) {
    //     toast.error('Permission not added ');
    //   }
    // }

    /// /=========delte
    const deleteData: any = {};
    const deletePerm: any = [];

    group.data.map((v: any, k: number) => {
      const tempDelete: any = {};
      const tempActionsDelete: string[] = [];
      tempDelete.email = v.email;
      Object.keys(v).map((a: string, i: number) => {
        !v[a] && a !== 'name' && a !== 'email' && a !== 'role' && tempActionsDelete.push(a);
      });
      tempDelete.actions = tempActionsDelete;
      deletePerm.push(tempDelete);
    });


    deleteData.propertyIdentifier = propertyIdentifier;
    deleteData.permissionDetails = deletePerm;

    try {
      if (addPerm.length !== 0) {
        useAddPermission1.mutateAsync({
          ...addData
        });
      }
      if (deletePerm.length !== 0) {
        deleteMember.mutateAsync({
          ...deleteData
        });
      }
      onClose()
      // toast.success('Permission updated successfully');
    } catch (error) {
      toast.error('Permission not deletd ');
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
              group.data.map((i: GroupItem) => (
                <Tr key={i.name}>
                  <Td>{i.name}</Td>
                  <Td>
                    <Checkbox
                      isChecked={i.APIKEY_CREATION}
                      onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                      id="APIKEY_CREATION"
                      name="APIKEY_CREATION"
                    // onClick={(e) => handleChange1(i.name, i.email, e)}
                    />
                  </Td>
                  <Td>
                    <Checkbox
                      isChecked={i.APIKEY_DELETION}
                      onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                      id="APIKEY_DELETION"
                      name="APIKEY_DELETION"
                    // onClick={(e) => handleChange1(i.name, i.email, e)}
                    />
                  </Td>
                  <Td>
                    <Checkbox
                      isChecked={i.PERMISSION_CREATION}
                      onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                      id="PERMISSION_CREATION"
                      name="PERMISSION_CREATION"
                    // onClick={handleChange1(i)}
                    />
                  </Td>
                  <Td>
                    <Checkbox
                      isChecked={i.PERMISSION_DELETION}
                      onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                      id="PERMISSION_DELETION"
                      name="PERMISSION_DELETION"
                    // onClick={handleChange1(i)}
                    />
                  </Td>
                  <Td>
                    <Checkbox
                      isChecked={i.ENV_CREATION}
                      onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                      id="ENV_CREATION"
                      name="ENV_CREATION"
                    // onClick={handleChange1(i)}
                    />
                  </Td>
                  <Td>
                    <Checkbox
                      isChecked={i.ENV_SYNC}
                      onChange={(checked, e) => handleChange(checked, e, i.name, i.email)}
                      id="ENV_SYNC"
                      name="ENV_SYNC"
                    // onClick={handleChange1(i)}
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
                        {/* {group['data'][0]['role']} */}{i.role}
                      </SplitItem>
                    </Split>
                  </AccordionToggle>
                  <AccordionContent
                    id={`def-list-expand1${i.name}`}
                    isHidden={expanded !== `def-list-toggle1_${i.name}`}
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
// send data of the songle member
