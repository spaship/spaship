import {
  Button,
  Form,
  FormGroup, Modal,
  ModalVariant, Popover,
  TextInput
} from "@patternfly/react-core";
import {
  Caption, TableComposable, Tbody,
  Td, Tr
} from "@patternfly/react-table";
import React, { FunctionComponent, useState } from "react";
import styled from 'styled-components';

interface DeleteSpaProps { }

const DeleteBox = styled.div`
  top: 40px;
  width: 1041px;
  height: 55px;
  border: 1px solid #D2D2D2;
  border-radius: 8px;
  opacity: 1;
`;

const DeleteSpa: FunctionComponent<DeleteSpaProps> = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [env, setEnv] = useState("");
  const tableVariant = "compact";
  const tableBorders = false;
  const handleModalToggle = async () => {
    setModalOpen(!isModalOpen);
  }
  const onClickMethod = async () => {
    setModalOpen(!isModalOpen);
  };
  const handleNameInputChange = (value: string) => {
    setEnv(value);
  };
  return (
    <>
      <TableComposable
        variant={tableVariant}
        borders={tableBorders}
      >
        <Caption>
          <b>Do you want to create an API Key !</b>
        </Caption>
        <Tbody>
          <DeleteBox>
            <Tr>
              <Td>
                <Button variant="danger" onClick={handleModalToggle}>
                  Delete Web Property
                </Button>
                <Modal
                  variant={ModalVariant.small}
                  title="Are Your Sure ? "
                  description="You are deleting this Web Property from SPAship. This operation will delete all data permanenetly."
                  isOpen={isModalOpen}
                  titleIconVariant="danger"
                  onClose={handleModalToggle}
                  actions={[
                    <Button key="create" variant="danger" onClick={onClickMethod}>
                      Yes, Delete
                    </Button>,
                    <Button
                      key="cancel"
                      variant="link"
                      onClick={handleModalToggle}
                    >
                      Cancel
                    </Button>,
                  ]}
                >
                  <Form id="modal-with-form-form">
                    <FormGroup
                      labelIcon={
                        <Popover bodyContent={null}>
                          <Button type="button"
                            onClick={(e) => e.preventDefault()}
                            aria-describedby="modal-with-form-form-name"
                            className="pf-c-form__group-label-help"
                          >
                          </Button>
                        </Popover>
                      }
                      isRequired
                      fieldId="modal-with-form-form-name"
                    >
                      <TextInput
                        isRequired
                        placeholder='Enter web property name'
                        type="text"
                        id="modal-with-form-form-name"
                        name="modal-with-form-form-name"
                        value={env}
                        onChange={handleNameInputChange}
                      />
                    </FormGroup>
                  </Form>
                </Modal>
              </Td>
            </Tr>
          </DeleteBox>
        </Tbody>
      </TableComposable>
    </>
  );
};

export default DeleteSpa;
