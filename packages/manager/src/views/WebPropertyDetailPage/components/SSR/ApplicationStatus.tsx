import { useGetStatusForAnApplication } from '@app/services/spaProperty';
import { Tooltip } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

export const ApplicationStatus = ({ link, _id }: { link: string; _id: string }) => {
  const { data } = useGetStatusForAnApplication(link, _id);
  return (
    <div style={{ display: 'inline' }}>
      {data ? (
        <Tooltip content={<div>Application is up and running</div>}>
          <CheckCircleIcon style={{ color: 'green' }} />
        </Tooltip>
      ) : (
        <Tooltip content={<div>Application is down</div>}>
          <ExclamationCircleIcon style={{ color: '#F0AB00' }} />
        </Tooltip>
      )}
    </div>
  );
};
