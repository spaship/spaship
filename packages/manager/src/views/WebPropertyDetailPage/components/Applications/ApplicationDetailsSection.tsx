import { TSpaProperty } from '@app/services/spaProperty/types';
import { convertDateFormat } from '@app/utils/convertDateFormat';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  ClipboardCopy
} from '@patternfly/react-core';
import { useState } from 'react';
import './ApplicationDetailsSection.css';

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
              <p className="appDetailSectionValue">{ref || 'NA'}</p>
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
                <span className="appDetailSectionlastUpdate">
                  last update: {convertDateFormat(updatedAt)}
                </span>
              </p>

              <p className="appDetailSectionBlueValue">
                {Array.isArray(routerUrl) &&
                  routerUrl.map((url, index) => (
                    <ClipboardCopy
                      // eslint-disable-next-line react/no-array-index-key
                      key={`appDetailSectionURL_${index}`}
                      style={{ backgroundColor: 'white' }}
                      hoverTip="Copy"
                      clickTip="Copied"
                      variant="inline-compact"
                      isReadOnly
                      onCopy={() => {
                        const textToCopy = `https://${url}`;
                        navigator.clipboard.writeText(textToCopy).then(
                          () => {
                            // Handle successful copy
                          },
                          (err) => {
                            // eslint-disable-next-line no-console
                            console.error('Copy failed', err);
                          }
                        );
                      }}
                    >
                      <a
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        href={`https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${url.slice(0, URL_LENGTH_LIMIT)}${
                          url.length > URL_LENGTH_LIMIT ? '...' : ''
                        }`}
                      </a>
                    </ClipboardCopy>
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
