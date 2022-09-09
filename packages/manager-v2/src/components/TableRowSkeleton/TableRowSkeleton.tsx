import { Skeleton } from '@patternfly/react-core';
import { Td, Tr } from '@patternfly/react-table';

interface Props {
  rows: number;
  columns: number;
}

export const TableRowSkeleton = ({ rows, columns }: Props): JSX.Element => (
  <>
    {Array.apply(0, Array(rows)).map((x, i) => (
      <Tr key={`skeletion-rows-${i + 1}`}>
        {Array.apply(0, Array(columns)).map((_x, j) => (
          <Td key={`skeleton-${i + 1}-${j + 1}`}>
            <Skeleton height="20px" width="50%" />
          </Td>
        ))}
      </Tr>
    ))}
  </>
);
