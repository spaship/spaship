import React, { useEffect } from 'react';
import '@one-platform/opc-feedback/dist/opc-feedback';

export const Feedback = (): JSX.Element => {
  React.useEffect(() => {
    // window is accessible here.
    console.log('window.innerHeight', window.innerHeight);
  }, []);

  return (
    <>
      <link
        type="text/css"
        rel="stylesheet"
        href="https://unpkg.com/@patternfly/patternfly/patternfly.css"
        crossorigin="anonymous"
      />
      <link
        type="text/css"
        rel="stylesheet"
        href="https://unpkg.com/@patternfly/patternfly/patternfly-addons.css"
        crossorigin="anonymous"
      />
      <script
        type="module"
        src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/5.5.0/ionicons/ionicons.esm.js"
      ></script>
      <script
        nomodule=""
        src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/5.2.3/ionicons/ionicons.js"
      ></script>
      <opc-feedback theme="blue" id="opc-feedback" />
      {/* <div>hello</div> */}
    </>
  );
};
