import React, { useState, useEffect, useCallback } from 'react';
import map from 'lodash/map';
import { Button } from '@patternfly/react-core';
import { IRow, Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import Page from '../../layout/Page';
import config from '../../config';
import UpdateApplication from './UpdateApplication';

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
    fetch(`${config.apiHost}/list`)
      .then(res => res.json())
      .then(appList => {
        setRows(
          map(appList, item => ({
            cells: [
              item.name,
              item.path && {
                title: (
                  <a
                    href={config.siteHost + item.path}
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
              {
                title: <UpdateApplication application={item}/>
              }
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
          <Button variant="primary">New Application</Button>
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
