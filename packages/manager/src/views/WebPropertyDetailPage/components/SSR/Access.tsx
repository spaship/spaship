import { useGetStatusForAnApplication } from '@app/services/spaProperty';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

export const Access = ({ link, _id }: { link: string; _id: string }) => {
  const { data } = useGetStatusForAnApplication(link, _id);

  return (
    <div>
      {data ? (
        <CheckCircleIcon style={{ color: 'green' }} />
      ) : (
        <ExclamationCircleIcon style={{ color: '#F0AB00' }} />
      )}
    </div>
  );
};
