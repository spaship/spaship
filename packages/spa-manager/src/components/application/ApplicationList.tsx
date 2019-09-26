import React, { useState, useEffect, useCallback } from 'react';
import map from 'lodash/map';
import { Button } from '@patternfly/react-core';
import { IRow, Table, TableHeader, TableBody } from '@patternfly/react-table';
import Page from '../../layout/Page';
import { Link } from 'react-router-dom';

interface IApp {
  name?: string;
  path: string;
  ref?: string;
}
export default () => {
  const [columns] = useState([
    { title: 'Name' },
    { title: 'Path' },
    { title: 'Ref' },
    { title: 'Actions' }
  ]);

  const [rows, setRows] = useState<IRow[]>([]);

  const fetchList = useCallback(() => {
    console.log('start to fetch');
    fetch('http://spandx.gsslab.rdu2.redhat.com:8008/list')
      .then(res => res.json())
      .then(appList => {
        setRows(
          map(appList, item => ({
            cells: [
              item.name,
              item.path && {
                title: (
                  <a
                    href={`https://spandx.usersys.redhat.com${item.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.path}
                  </a>
                )
              },
              item.ref && {
                title: <a href={`#${item.ref}`}>{item.ref.substring(0, 6)}</a>
              },
              ''
            ]
          }))
        );
      });
  }, []);

  useEffect(() => {
    fetchList();
    const refresh = setInterval(fetchList, 5000);
    return () => clearInterval(refresh);
  }, [fetchList]);

  return (
    <Page
      title="Application List"
      subTitle={
        <Link to={`/applications/new`}>
          <Button variant="primary">Upload to Deploy</Button>
        </Link>
      }
    >
      <Table cells={columns} rows={rows} aria-label="Application List">
        <TableHeader />
        <TableBody />
      </Table>
    </Page>
  );
};
