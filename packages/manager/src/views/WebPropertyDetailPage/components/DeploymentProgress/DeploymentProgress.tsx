import React, { useState, useEffect } from 'react';
import { ProgressStep, ProgressStepper } from '@patternfly/react-core';
import { toPascalCase } from '@app/utils/toPascalConvert';

const getStepVariant = (action: string) => {
  switch (action) {
    case 'FORM_UPLOAD':
    case 'BUILD_STARTED':
    case 'DEPLOYMENT_STARTED':
      return 'info';
    case 'VALIDATION_SUCCESS':
    case 'BUILD_FINISHED':
    case 'DEPLOYMENT_FINISHED':
      return 'success';
    case 'BUILD_FAILED':
    case 'DEPLOYMENT_FAILED':
      return 'danger';
    default:
      return 'default';
  }
};
const data1 = [
  {
    _id: '6436ac58ea46dfe6955a1433',
    propertyIdentifier: 'testnikki',
    action: 'PERMISSION_CREATED',
    props: {
      applicationIdentifier: 'NA',
      env: 'NA'
    },
    message: 'APPLICATION_CREATION access provided for souchowd@redhat.com',
    payload:
      '{"name":"Soumyadip Chowdhury","email":"souchowd@redhat.com","propertyIdentifier":"testnikki","action":"APPLICATION_CREATION","createdBy":"nmore@redhat.com","updatedBy":"nmore@redhat.com"}',
    source: 'MANAGER',
    createdBy: 'nmore@redhat.com',
    createdAt: '2023-04-12T13:04:24.998Z',
    updatedAt: '2023-04-12T13:04:24.998Z',
    __v: 0
  },
  {
    _id: '6436ac58ea46dfe6955a1430',
    propertyIdentifier: 'testnikki',
    action: 'FORM_UPLOADED',
    props: {
      applicationIdentifier: 'NA',
      env: 'NA'
    },
    message: 'ENV_SYNC access provided for souchowd@redhat.com',
    payload:
      '{"name":"Soumyadip Chowdhury","email":"souchowd@redhat.com","propertyIdentifier":"testnikki","action":"ENV_SYNC","createdBy":"nmore@redhat.com","updatedBy":"nmore@redhat.com"}',
    source: 'GIT',
    createdBy: 'nmore@redhat.com',
    createdAt: '2023-04-12T13:04:24.993Z',
    updatedAt: '2023-04-12T13:04:24.993Z',
    __v: 0
  },
  {
    _id: '6436ab39ea46dfe6955a139a',
    propertyIdentifier: 'testnikki',
    action: 'VALIDATION_SUCCESS',
    props: {
      applicationIdentifier: 'NA',
      env: 'dev'
    },
    message: 'NA',
    payload: 'NA',
    source: 'GIT',
    createdBy: 'NA',
    createdAt: '2023-04-12T12:59:37.710Z',
    updatedAt: '2023-04-12T12:59:37.710Z',
    __v: 0
  },
  {
    _id: '6436ab39ea46dfe6955a139a',
    propertyIdentifier: 'testnikki',
    action: 'BUILD_STARTED',
    props: {
      applicationIdentifier: 'NA',
      env: 'dev'
    },
    message: 'NA',
    payload: 'NA',
    source: 'GIT',
    createdBy: 'NA',
    createdAt: '2023-04-12T12:59:37.710Z',
    updatedAt: '2023-04-12T12:59:37.710Z',
    __v: 0
  },
  {
    _id: '6436ac58ea46dfe6955a142d',
    propertyIdentifier: 'testnikki',
    action: 'BUILD_FINISHED',
    props: {
      applicationIdentifier: 'NA',
      env: 'NA'
    },
    message: 'ENV_CREATION access provided for souchowd@redhat.com',
    payload:
      '{"name":"Soumyadip Chowdhury","email":"souchowd@redhat.com","propertyIdentifier":"testnikki","action":"ENV_CREATION","createdBy":"nmore@redhat.com","updatedBy":"nmore@redhat.com"}',
    source: 'GIT',
    createdBy: 'nmore@redhat.com',
    createdAt: '2023-04-12T13:04:24.986Z',
    updatedAt: '2023-04-12T13:04:24.986Z',
    __v: 0
  },
  // {
  //   _id: '6436ab39ea46dfe6955a139a',
  //   propertyIdentifier: 'testnikki',
  //   action: 'BUILD_FAILED',
  //   props: {
  //     applicationIdentifier: 'NA',
  //     env: 'dev'
  //   },
  //   message: 'NA',
  //   payload: 'NA',
  //   source: 'GIT',
  //   createdBy: 'NA',
  //   createdAt: '2023-04-12T12:59:37.710Z',
  //   updatedAt: '2023-04-12T12:59:37.710Z',
  //   __v: 0
  // },
  {
    _id: '6436ab39ea46dfe6955a139a',
    propertyIdentifier: 'testnikki',
    action: 'DEPLOYMENT_STARTED',
    props: {
      applicationIdentifier: 'NA',
      env: 'dev'
    },
    message: 'NA',
    payload: 'NA',
    source: 'GIT',
    createdBy: 'NA',
    createdAt: '2023-04-12T12:59:37.710Z',
    updatedAt: '2023-04-12T12:59:37.710Z',
    __v: 0
  },
  {
    _id: '6436ab39ea46dfe6955a139a',
    propertyIdentifier: 'testnikki',
    action: 'DEPLOYMENT_FINISHED',
    props: {
      applicationIdentifier: 'NA',
      env: 'dev'
    },
    message: 'NA',
    payload: 'NA',
    source: 'GIT',
    createdBy: 'NA',
    createdAt: '2023-04-12T12:59:37.710Z',
    updatedAt: '2023-04-12T12:59:37.710Z',
    __v: 0
  },

  {
    _id: '6436ac58ea46dfe6955a142a',
    propertyIdentifier: 'testnikki',
    action: 'PERMISSION_CREATED',
    props: {
      applicationIdentifier: 'NA',
      env: 'NA'
    },
    message: 'APIKEY_CREATION access provided for souchowd@redhat.com',
    payload:
      '{"name":"Soumyadip Chowdhury","email":"souchowd@redhat.com","propertyIdentifier":"testnikki","action":"APIKEY_CREATION","createdBy":"nmore@redhat.com","updatedBy":"nmore@redhat.com"}',
    source: 'MANAGER',
    createdBy: 'nmore@redhat.com',
    createdAt: '2023-04-12T13:04:24.980Z',
    updatedAt: '2023-04-12T13:04:24.980Z',
    __v: 0
  },
  {
    _id: '6436ab76ea46dfe6955a1411',
    propertyIdentifier: 'testnikki',
    action: 'APIKEY_DELETED',
    props: {
      applicationIdentifier: 'NA',
      env: 'dev'
    },
    message: '2bec352 Deleted for testnikki',
    payload:
      '{"_id":"6436ab4bea46dfe6955a13fe","propertyIdentifier":"testnikki","shortKey":"2bec352","hashKey":"ea0f2c190721ffb8382bfaa2a9c7f5d197dfb68cf39c39879e2c247118f4050c","env":["dev"],"label":"dev","expirationDate":"2023-04-28T12:59:55.996Z","createdBy":"nmore@redhat.com","createdAt":"2023-04-12T12:59:55.998Z","updatedAt":"2023-04-12T12:59:55.998Z","__v":0}',
    source: 'MANAGER',
    createdBy: 'nmore@redhat.com',
    createdAt: '2023-04-12T13:00:38.752Z',
    updatedAt: '2023-04-12T13:00:38.752Z',
    __v: 0
  },
  {
    _id: '6436ab4bea46dfe6955a13ff',
    propertyIdentifier: 'testnikki',
    action: 'APIKEY_CREATED',
    props: {
      applicationIdentifier: 'NA',
      env: 'dev'
    },
    message: '2bec352 Created for testnikki',
    payload:
      '{"propertyIdentifier":"testnikki","createdBy":"nmore@redhat.com","label":"dev","env":["dev"],"hashKey":"ea0f2c190721ffb8382bfaa2a9c7f5d197dfb68cf39c39879e2c247118f4050c","shortKey":"2bec352","expirationDate":"2023-04-28T12:59:55.996Z"}',
    source: 'MANAGER',
    createdBy: 'nmore@redhat.com',
    createdAt: '2023-04-12T12:59:55.999Z',
    updatedAt: '2023-04-12T12:59:55.999Z',
    __v: 0
  },

  {
    _id: '6436ab39ea46dfe6955a1397',
    propertyIdentifier: 'testnikki',
    action: 'PROPERTY_CREATED',
    props: {
      applicationIdentifier: 'NA',
      env: 'NA'
    },
    message: 'NA',
    payload: 'NA',
    source: 'Manager',
    createdBy: 'NA',
    createdAt: '2023-04-12T12:59:37.703Z',
    updatedAt: '2023-04-12T12:59:37.703Z',
    __v: 0
  },
  {
    _id: '6436ab39ea46dfe6955a1394',
    propertyIdentifier: 'testnikki',
    action: 'PERMISSION_CREATED',
    props: {
      applicationIdentifier: 'NA',
      env: 'NA'
    },
    message: 'APPLICATION_CREATION access provided for nmore@redhat.com',
    payload:
      '{"name":"Nikhita More","email":"nmore@redhat.com","propertyIdentifier":"testnikki","action":"APPLICATION_CREATION","createdBy":"nmore@redhat.com","updatedBy":"nmore@redhat.com"}',
    source: 'MANAGER',
    createdBy: 'nmore@redhat.com',
    createdAt: '2023-04-12T12:59:37.697Z',
    updatedAt: '2023-04-12T12:59:37.697Z',
    __v: 0
  },
  {
    _id: '6436ab39ea46dfe6955a1391',
    propertyIdentifier: 'testnikki',
    action: 'DEPLOYMENT_FAILED',
    props: {
      applicationIdentifier: 'NA',
      env: 'NA'
    },
    message: 'PERMISSION_DELETION access provided for nmore@redhat.com',
    payload:
      '{"name":"Nikhita More","email":"nmore@redhat.com","propertyIdentifier":"testnikki","action":"PERMISSION_DELETION","createdBy":"nmore@redhat.com","updatedBy":"nmore@redhat.com"}',
    source: 'GIT',
    createdBy: 'nmore@redhat.com',
    createdAt: '2023-04-12T12:59:37.691Z',
    updatedAt: '2023-04-12T12:59:37.691Z',
    __v: 0
  }
];

type Props = {
  propertyIdentifier: string;
};
export const DeploymentProgress = ({ propertyIdentifier }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const data = data1
    .filter((item) => item.source === 'GIT')
    .map((item) => ({ action: getStepVariant(item.action), des: item.action }));

  const [stepStatuses, setStepStatuses] = useState(data.map(() => 'info'));

  useEffect(() => {
    if (currentStep >= data.length) return;

    const newData = [...stepStatuses];
    // newData[currentStep] = ProgressVariant.success;
    data.map(({ action }, _index) => (newData[currentStep] = action));
    setStepStatuses(newData);
    const intervalId = setInterval(() => {
      if (currentStep >= data.length) return;
      setCurrentStep((prevStep) => prevStep + 1);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentStep]);

  return (
    <ProgressStepper isCenterAligned className="pf-u-mr-md pf-u-mt-lg">
      {data.map(({ action, des }, index) => (
        <ProgressStep
          key={des}
          variant={stepStatuses[index]}
          title={action}
          description={index < currentStep ? 'Complete' : 'Pending'}
        >
          {toPascalCase(des)}
        </ProgressStep>
      ))}
    </ProgressStepper>
  );
};
