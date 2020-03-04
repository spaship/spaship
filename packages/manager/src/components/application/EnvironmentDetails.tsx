import React from "react";
import { IRow, Table, TableHeader, TableBody } from "@patternfly/react-table";
import { TextContent, Text, Card, CardHeader, CardBody } from "@patternfly/react-core";

export default () => {
  const columns: string[] = ["Name", "Url", "Version", "Update"];
  const rows: IRow[] = [
    {
      cells: [
        "Dev",
        {
          title: (
            <a href="https://access.dev.redhat.com/spaship" target="_blank" rel="noopener noreferrer">
              https://access.dev.redhat.com/spaship
            </a>
          )
        },
        "1.2.0",
        "2020-02-02 22:22:22"
      ]
    },
    {
      cells: [
        "QA",
        {
          title: (
            <a href="https://access.qa.redhat.com/spaship" target="_blank" rel="noopener noreferrer">
              https://access.qa.redhat.com/spaship
            </a>
          )
        },
        "1.1.3",
        "2020-02-02 22:22:22"
      ]
    },
    {
      cells: [
        "Stage",
        {
          title: (
            <a href="https://access.stage.redhat.com/spaship" target="_blank" rel="noopener noreferrer">
              https://access.stage.redhat.com/spaship
            </a>
          )
        },
        "1.1.0",
        "2020-02-02 22:22:22"
      ]
    },
    {
      cells: [
        "Production",
        {
          title: (
            <a href="https://access.redhat.com/spaship" target="_blank" rel="noopener noreferrer">
              https://access.redhat.com/spaship
            </a>
          )
        },
        "1.0.0",
        "2020-02-02 22:22:22"
      ]
    }
  ];
  return (
    <Card isHoverable>
      <CardHeader>
        <TextContent>
          <Text component="h3">Environment Details</Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Table cells={columns} rows={rows} aria-label="Environment List">
          <TableHeader />
          <TableBody />
        </Table>
      </CardBody>
    </Card>
  );
};
