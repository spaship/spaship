import { useEffect, useState } from 'react';
import {
  Split,
  SplitItem,
  FormGroup,
  TextInput,
  Radio,
  Tooltip,
  Button
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { fetchCmdbCodeById, fetchCmdbCodeByName } from '@app/services/webProperty';
import { useGetEditCmdbDetailsForApplication } from '@app/services/spaProperty/queries';
import toast from 'react-hot-toast';
import { useGetEditCmdbDetailsForProperty } from '@app/services/webProperty/queries';

// Validation Schema
const schema = yup.object({
  cmdbCode: yup
    .string()
    .max(10, 'CMDB code must be 10 characters or less')
    .test('special-chars', 'CMDB code cannot contain special characters', (value) => {
      if (!value) return true;
      return /^[A-Za-z0-9-]+$/.test(value);
    })
    .required('CMDB code is required'),
  severity: yup.string()
});

// FormData interface
export interface FormData extends yup.InferType<typeof schema> {}

// TCmdbValidation type
export type TCmdbValidation = {
  name: string;
  code: string;
  url: string;
  email: string;
  severity: string;
};

interface Props {
  propertyIdentifier: string;
  applicationIdentifier: string | undefined;
  handlePopUpClose: (x: string) => void;
}

export const EditCmdbDetails = ({
  propertyIdentifier,
  applicationIdentifier,
  handlePopUpClose
}: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const [cmdbName, setCmdbName] = useState(false);
  const [cmdbId, setCmdbId] = useState(true);
  const [cmdbCode, setCmdbCode] = useState('');
  const [cmdbData, setCmdbData] = useState<TCmdbValidation[]>([]);
  const [cmdbError, setCmdbError] = useState(false);

  useEffect(() => {
    if ((cmdbCode && cmdbId) || (cmdbCode && cmdbName)) {
      let fetchPromise;

      if (cmdbId) {
        fetchPromise = fetchCmdbCodeById(cmdbCode);
      } else if (cmdbName) {
        fetchPromise = fetchCmdbCodeByName(cmdbCode);
      }

      if (fetchPromise) {
        fetchPromise.then((data) => {
          setCmdbData(data);
          if (data.length === 0) {
            setCmdbError(true);
          } else {
            setCmdbError(false);
          }
        });
      }
    }
  }, [cmdbCode, cmdbName, cmdbId]);

  const handleChangecmdbName = () => {
    setCmdbName(true);
    setCmdbId(false);
  };

  const handleChangecmdbId = () => {
    setCmdbId(true);
    setCmdbName(false);
  };

  const editCmdbApplication = useGetEditCmdbDetailsForApplication(propertyIdentifier);
  const editCmdbProperty = useGetEditCmdbDetailsForProperty();

  const onSubmit = async (data: FormData) => {
    const updatedData = {
      ...data,
      cmdbCode: cmdbData[0]?.code || 'NA',
      severity: cmdbData[0]?.severity || 'NA',
      propertyIdentifier,
      applicationIdentifier
    };

    try {
      if (applicationIdentifier) {
        await editCmdbApplication.mutateAsync({
          ...updatedData
        });
      } else {
        await editCmdbProperty.mutateAsync({
          ...updatedData
        });
      }
      toast.success('CMDB Deatils updated successfully');
    } catch (error) {
      toast.error('Failed to update CMDB details');
    }
    handlePopUpClose('editCmdbCode');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Split hasGutter className="pf-u-mt-xl">
        <SplitItem isFilled>
          <Controller
            control={control}
            name="cmdbCode"
            render={({ field }) => (
              <FormGroup
                label={
                  <>
                    CMDB Code
                    <Tooltip
                      content={<div>Please provide the CMDB code for your application.</div>}
                    >
                      <span>
                        &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
                      </span>
                    </Tooltip>
                  </>
                }
                isRequired
                fieldId="property-cmdb"
                validated={errors.cmdbCode ? 'error' : 'default'}
                helperTextInvalid={errors.cmdbCode?.message}
                helperText="CMDB code can contain only letters, numbers, and dashes are allowed"
              >
                <TextInput
                  isRequired
                  placeholder="Enter cmdb code"
                  type="text"
                  id="property-cmdb"
                  value={cmdbData.length > 0 ? cmdbData[0]?.code : cmdbCode}
                  onChange={(value) => {
                    setCmdbCode(value);
                    field.onChange(value);
                  }}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem className="pf-u-mt-lg">
          <Radio
            isChecked={cmdbId}
            name="Cmdb Id"
            onChange={handleChangecmdbId}
            label="CMDB Id"
            id="cmdb-id"
          />
        </SplitItem>
        <SplitItem className="pf-u-mt-lg">
          <Radio
            isChecked={cmdbName}
            name="Cmdb Name"
            onChange={handleChangecmdbName}
            label="CMDB Name"
            id="cmdb-name"
          />
        </SplitItem>
      </Split>
      {cmdbError && (
        <p style={{ color: '#c9190b', fontFamily: 'REDHATTEXT', fontSize: '14px' }}>
          The entered CMDB code is incorrect. Please verify the value you entered and the selected
          type.
        </p>
      )}
      <Split hasGutter className="pf-u-my-xl">
        <SplitItem>
          <Controller
            control={control}
            name="severity"
            defaultValue=""
            render={({ field }) => (
              <FormGroup
                label="Application Severity"
                isRequired
                fieldId="property-sev"
                validated={errors.severity ? 'error' : 'default'}
                helperTextInvalid={errors.severity?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Severity of the application"
                  type="text"
                  id="property-sev"
                  value={cmdbData.length > 0 ? cmdbData[0]?.severity || 'NA' : 'NA'}
                  isDisabled
                  onChange={field.onChange}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>
      <Button type="submit" isDisabled={isSubmitting || cmdbError}>
        Submit
      </Button>
    </form>
  );
};
