import React, { PropTypes } from 'react';
import { $ } from 'meteor/jquery';

const Help = ({ children }) => {
  let collapsed;
  
  return (
    <div className="help-info" onClick={() => $(collapsed).collapse('toggle')}>
      {/* TODO: Replace to button component after merge with rewrite on react*/}
      <button type="button" className="btn btn-link help-icon btn-collapse collapsed">
        <i className="fa fa-question-circle" />
      </button>
      <div className="collapse guidance-panel" ref={collapsedRef => { collapsed = collapsedRef; }}>
        <div className="card-block">
          <div>{children}</div>
          {/* TODO: Replace to button component after merge with rewrite on react*/}
          <div className="btn-group">
            <a
              className="btn btn-link guidance-panel-close pointer"
              onClick={() => $(collapsed).collapse('hide')}
            >
              Close
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

Help.propTypes = {
  children: PropTypes.node,
};

export default Help;
