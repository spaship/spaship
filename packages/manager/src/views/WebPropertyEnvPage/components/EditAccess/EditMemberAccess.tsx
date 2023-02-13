/* eslint-disable */
import { useForm } from 'react-hook-form';
import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  fetchRoleForIndividual,
  useAddPermission,
  useGetRoleForIndividual,
  useDeletePermission,
  useDeleteMember
} from '@app/services/rbac';
import {
  Button,
  Checkbox,
  Split,
  SplitItem,
  Dropdown,
  DropdownItem,
  SelectProps,
  DropdownToggle,
  Select,
  SelectOption,
  SelectVariant,
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle
} from '@patternfly/react-core';
import {
  CustomActionsToggleProps,
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@patternfly/react-table';
import toast from 'react-hot-toast';
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
interface groupType {
  [key: string]: Object;
}
type Props = {
  onSubmit?: (data: FormData) => void;
  onClose?: () => void;
  editMemberName: string;
  propertyIdentifier: string;
  memberList: any;
};
export const EditMemberAccess = ({
  onSubmit,
  onClose,
  editMemberName,
  propertyIdentifier,
  memberList
}: Props): JSX.Element => {
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { isSubmitting }
  // } = useForm<FormData>({
  //   mode: 'onBlur',
  //   resolver: yupResolver(schema)
  // });
  const [isOpenDropdown, setIsOpenDropdown] = React.useState(false);
  const [expanded, setExpanded] = React.useState('def-list-toggle2');
  const [addAccess, setaddAccess] = React.useState([]);
  const [deleteAccess, setdeleteAccess] = React.useState([]);
  const data1 = memberList.data.filter((e: any) => e.name === editMemberName);
  const [group, setGroup] = React.useState({ data: data1 });
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
    let target: any;
    target = event.currentTarget;
    const temp = group.data;
    const addAccess1: any = addAccess;
    const deleteAccess1: any = deleteAccess;
    temp.filter((e: any) => e.email === email)[0][target.name] = checked;
    setGroup({ data: temp });
    // console.log("temp")
    // if (checked) {
    //   addAccess1.push(target.name as never);
    //   deleteAccess1.pop(target.name);
    // } else {
    //   deleteAccess1.push(target.name as never);
    //   addAccess1.pop(target.name);
    // }
    // console.log("addaccess in handke", addAccess1)
    // console.log("deleteAccess1 in handke", deleteAccess1)

    // setaddAccess(addAccess1);
    // setdeleteAccess(deleteAccess1);
    // console.log("addaccess in handke", addAccess1)
    // console.log("deleteAccess1 in handke", deleteAccess1)
  };

  const onToggleDropdown = (isOpen: boolean, event: any) => {
    // event.stopPropagation()
    setIsOpenDropdown(isOpen);
  };
  const onFocusDropdown = () => {
    const element: any = document.getElementById('role-dropdown');
    element.focus();
  };
  const onSelectDropdown = () => {
    setIsOpenDropdown(false);
    onFocusDropdown();
  };

  const dropdownItems = [
    <DropdownItem key="link" tooltip="Tooltip for enabled link">
      Link
    </DropdownItem>,
    <DropdownItem key="action" component="button" tooltip="Tooltip for enabled button">
      Action
    </DropdownItem>
  ];
  const useAddPermission1 = useAddPermission(propertyIdentifier);
  const deleteMember = useDeleteMember(propertyIdentifier);
  const handleSubmit = () => {
    console.log("group data", group)
    const addData: any = {};
    const addPerm: any = [];
    let addflag = false
    group.data.map((v: any, k: number) => {
      const temp: any = {};
      const tempActions: string[] = [];
      temp.name = v.name;
      temp.email = v.email;
      Object.keys(v).map((a: string, i: number) => {
        v[a] && a !== 'name' && a !== 'email' && a !== 'role' && tempActions.push(a);
      });
      if (tempActions.length !== 0) {
        addflag = true
      }
      temp.actions = tempActions;
      addPerm.push(temp);
    });
    addData.propertyIdentifier = propertyIdentifier;
    addData.permissionDetails = addPerm;

    const deleteData: any = {};
    const deletePerm: any = [];
    let deleteflag = false
    group.data.map((v: any, k: number) => {
      const tempDelete: any = {};
      const tempActionsDelete: string[] = [];
      tempDelete.email = v.email;
      Object.keys(v).map((a: string, i: number) => {
        !v[a] && a !== 'name' && a !== 'email' && a !== 'role' && tempActionsDelete.push(a);
      });
      if (tempActionsDelete.length !== 0) {
        deleteflag = true
      }
      tempDelete.actions = tempActionsDelete;
      deletePerm.push(tempDelete);
    });


    deleteData.propertyIdentifier = propertyIdentifier;
    deleteData.permissionDetails = deletePerm;

    try {
      console.log("addPerm", addPerm)
      console.log("deleted perm", deletePerm, "flag", deleteflag)
      if (addPerm.length !== 0) {
        useAddPermission1.mutateAsync({
          ...addData
        });
      }
      if (deleteflag) {
        deleteMember.mutateAsync({
          ...deleteData
        });
      }
      onClose()
      toast.success('Permission updated successfully');
    } catch (error) {
      toast.error('Permission not deleted ');
    }
    //     const addresult = {
    //       propertyIdentifier,
    //       permissionDetails: [
    //         {
    //           name: editMemberName,
    //           email: group.data[0].email,
    //           actions: addAccess
    //         }
    //       ]
    //     };
    //     const removeResult = {
    //       propertyIdentifier,
    //       permissionDetails: [
    //         {
    //           name: editMemberName,
    //           email: group.data[0].email,
    //           actions: deleteAccess
    //         }
    //       ]
    //     };

    // console.log("in edit addaccess 0066",addresult, addAccess)
    // console.log("in edit deleteacc 0066",removeResult,deleteAccess)

    //     if (deleteAccess.length !== 0) {
    //       try {
    //         deleteMember.mutateAsync({
    //           ...removeResult as any
    //         });
    //         // useDeletePermission(removeResult as any);
    //         onClose()
    //         toast.success('Permission updated successfully');
    //       } catch (error) {
    //         toast.error('Permission not deleted for the user');
    //       }
    //     }
    //     if (addAccess.length !== 0) {

    //       //  useAddPermission(addresult)
    //       try {
    //         useAddPermission1.mutateAsync({
    //           ...addresult as any
    //         });
    //         onClose()
    //         toast.success('Permission updated successfully');
    //       } catch (error) {
    //         toast.error('Permission not added for the user');
    //       }
    //     }
  };


  // const toPascalCase = (sentence) => sentence
  // .toLowerCase()
  // .replace(new RegExp(/[^\w\s]/, 'g'), '')
  // .replace('_', ' ')
  // .trim()
  // .split(' ')
  // .map(word => word[0]
  // .toUpperCase()
  // .concat(word.slice(1)))
  // .join(' ');

  return (
    <div>
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
                    group.data.map((i: any) => (
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <br />
      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};
// send data of the songle member
