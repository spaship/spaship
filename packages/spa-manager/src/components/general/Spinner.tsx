import React from 'react';
import './Spinner.css';
export default () => {
  return (
    <div>
      <span
        className="pf-c-spinner"
        role="progressbar"
        aria-valuetext="Loading...."
      >
        <span className="pf-c-spinner__clipper"></span>
        <span className="pf-c-spinner__lead-ball"></span>
        <span className="pf-c-spinner__tail-ball"></span>
      </span>
    </div>
  );
};
