import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Pagination, Bullseye } from "@patternfly/react-core";
import { Table, TableHeader, TableBody, IRow, compoundExpand, IRowCell, ICell } from "@patternfly/react-table";
import { Link } from "react-router-dom";
import { IApplication } from "../../models/Application";
import ApplicationEnvironmentColumn from "./ApplicationEnvironmentColumn";
import EmptySpinner from "../general/EmptySpinner";
import EmptyNotFound from "../general/EmptyNotFound";
import { IEnvironment } from "../../config";
import EmptyAccessDenied from "../general/EmptyAccessDenied";

interface IProps {
  isLoading: boolean;
  hasAccess: boolean;
  environments?: IEnvironment[];
  applications: IApplication[];
}

const perPages = [10, 20, 50, 100];

export default (props: IProps) => {
  const { applications, isLoading, environments } = props;
  const { hasAccess } = props || true;
  const [rows, setRows] = useState<IRow[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(perPages[0]);

  const envs = useMemo(() => environments || [], [environments]);

  const environmentNames = envs.map((env) => ({ title: env.name, cellTransforms: [compoundExpand] }));

  const columns: ICell[] = [
    {
      title: "Name",
    },
    {
      title: "Path",
    },
  ].concat(environmentNames);

  const applicationsToRows = useCallback(
    (apps: IApplication[]) => {
      return apps.map((app) => ({
        cells: [
          {
            title: <Link to={`/applications/${app.name}`}>{app.name}</Link>,
          },
          app.path,
        ].concat(
          envs.map((env) => ({
            title: <ApplicationEnvironmentColumn application={app} environment={env} />,
          }))
        ),
      }));
    },
    [envs]
  );

  useEffect(() => {
    if (isLoading) {
      setRows([
        {
          heightAuto: true,
          cells: [
            {
              props: { colSpan: 6 },
              title: (
                <Bullseye>
                  <EmptySpinner />
                </Bullseye>
              ),
            },
          ],
        },
      ]);
    } else {
      if (!hasAccess) {
        setRows([{
          heightAuto: true,
          cells: [{
            props: { colSpan: 6 },
            title: (
              <Bullseye>
                <EmptyAccessDenied
                  title="Access Denied"
                  body="You are not authorized to access this page! If you think this is a mistake or you need to have access to this page, please contact a SPAship admin to add you to the spaship-users LDAP group(s) for this property."
                />
              </Bullseye>
            ),
          }],
        }]);
      } else if (applications.length === 0) {
        setRows([{
          heightAuto: true,
          cells: [{
            props: { colSpan: 6 },
            title: (
              <Bullseye>
                <EmptyNotFound
                  title="No Application Found"
                  body="To find out how to deploy your SPA please read the SPAship documentation."
                />
              </Bullseye>
            ),
          }],
        }]);
      } else {
        setRows(applicationsToRows(applications.slice(0, perPage)));
      }
    }
  }, [applications, isLoading, applicationsToRows, perPage, hasAccess]);

  const onExpand = (event: any, rowIndex: number, colIndex: number, isOpen: boolean) => {
    if (!isOpen) {
      (rows[rowIndex].cells as IRowCell[]).forEach((cell) => {
        if (cell.props) cell.props.isOpen = false;
      });
      (rows[rowIndex].cells as IRowCell[])[colIndex].props.isOpen = true;
      rows[rowIndex].isOpen = true;
    } else {
      (rows[rowIndex].cells as IRowCell[])[colIndex].props.isOpen = false;
      rows[rowIndex].isOpen = (rows[rowIndex].cells as IRowCell[]).some((cell) => cell.props && cell.props.isOpen);
    }
    setRows([...rows]);
  };

  const handleSetPage = (
    _evt: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
    perPage?: number,
    startIdx?: number,
    endIdx?: number
  ) => {
    setPage(newPage);
    setRows(applicationsToRows(applications.slice(startIdx, endIdx)));
  };

  const handlePerPageSelect = (
    _evt: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
    startIdx?: number,
    endIdx?: number
  ) => {
    setPerPage(newPage);
    setPage(newPage);
    setRows(applicationsToRows(applications.slice(startIdx, endIdx)));
  };

  const renderPagination = (variant = "bottom") => {
    return (
      <Pagination
        itemCount={applications.length}
        page={page}
        perPage={perPage}
        defaultToFullPage
        onSetPage={handleSetPage}
        onPerPageSelect={handlePerPageSelect}
        perPageOptions={perPages.map((p) => ({
          title: p.toString(),
          value: p,
        }))}
      />
    );
  };

  return (
    <>
      <Table cells={columns} rows={rows} onExpand={onExpand} aria-label="Application List">
        <TableHeader />
        <TableBody />
      </Table>
      {renderPagination()}
    </>
  );
};
