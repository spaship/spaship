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
  data: TSpaProperty[];
  webProperties: any;
}

const URL_LENGTH_LIMIT = 25;
export const ApplicationDetailsSection = ({ data, webProperties }: Props): JSX.Element => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const onToggle = (id: string) => {
    setExpanded((prevExpanded) => (prevExpanded === id ? null : id));
  };

  return (
    <div>
      <br />
      <h3>Environments</h3>
      <br />
      <Accordion asDefinitionList>
        {data.map(({ _id, env, ref, routerUrl, updatedAt }) => (
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
              <p>
                <p className="appDetailSectionHeading">Publish Domain</p>
                <p
                  className="appDetailSectionBlueValue"
                  style={{ maxWidth: '20ch', wordWrap: 'break-word' }}
                >
                  {' '}
                  <a
                    href={`https://${webProperties?.data?.[env]?.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${webProperties?.data?.[env]?.url.slice(0, URL_LENGTH_LIMIT) ?? 'NA'} ${
                      webProperties?.data?.[env]?.url &&
                      webProperties?.data?.[env]?.url.length > URL_LENGTH_LIMIT
                        ? '...'
                        : ''
                    }`}
                  </a>
                </p>
              </p>

              <br />
              <p className="appDetailSectionHeading">
                Router URL{' '}
                <span className="appDetailSectionlastUpdate">last update: {updatedAt}</span>
              </p>

              <p className="appDetailSectionBlueValue">
                {Array.isArray(routerUrl) &&
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
                  ))}
              </p>
              <br />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
