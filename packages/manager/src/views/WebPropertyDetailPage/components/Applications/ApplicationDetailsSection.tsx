import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  ClipboardCopy
} from '@patternfly/react-core';
import React, { useState } from 'react';
import './ApplicationDetailsSection.css';
import { TSpaProperty } from '@app/services/spaProperty/types';

interface Props {
  selectedAppIdentifier: string;
  data: TSpaProperty[];
}

const URL_LENGTH_LIMIT = 25;
export const ApplicationDetailsSection = ({ selectedAppIdentifier, data }: Props): JSX.Element => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const onToggle = (id: string) => {
    setExpanded((prevExpanded) => (prevExpanded === id ? null : id));
  };

  console.log('ApplicationDetailsSection', selectedAppIdentifier, data);

  return (
    <div>
      <br />
      <h3>Environments</h3>
      <br />
      <Accordion asDefinitionList>
        {data.map(({ _id, env, ref, routerUrl, path, updatedAt }) => (
          <AccordionItem key={_id}>
            <AccordionToggle
              onClick={() => {
                onToggle(`def-list-toggle${env}`);
              }}
              isExpanded={expanded === `def-list-toggle${env}`}
              id={`def-list-toggle${env}`}
            >
              {env}
            </AccordionToggle>
            <AccordionContent
              id={`def-list-toggle${env}`}
              isHidden={expanded !== `def-list-toggle${env}`}
            >
              <p className="appDetailSectionHeading">Reference</p>
              <p className="appDetailSectionValue">{ref}</p>
              <br />
              <p className="appDetailSectionHeading">Path</p>
              <p className="appDetailSectionBlueValue">{path}</p>
              <br />
              <p className="appDetailSectionHeading">
                Router URL{' '}
                <span className="appDetailSectionlastUpdate">last update: {updatedAt}</span>
              </p>

              <p className="appDetailSectionBlueValue">
                {Array.isArray(routerUrl) ? (
                  routerUrl.map((url, index) => (
                    <a
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      href={`https://${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ClipboardCopy
                        style={{ backgroundColor: 'white' }}
                        hoverTip="Copy"
                        clickTip="Copied"
                        variant="inline-compact"
                      >
                        {`${url.slice(0, URL_LENGTH_LIMIT)}${
                          url.length > URL_LENGTH_LIMIT ? '...' : ''
                        }`}
                      </ClipboardCopy>
                    </a>
                  ))
                ) : (
                  <a href={`https://${routerUrl}`} target="_blank" rel="noopener noreferrer">
                    {`${routerUrl.slice(0, URL_LENGTH_LIMIT)}${
                      routerUrl.length > URL_LENGTH_LIMIT ? '...' : ''
                    }`}
                  </a>
                )}
              </p>
              <br />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
