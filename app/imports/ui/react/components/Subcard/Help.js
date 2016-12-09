import React, { PropTypes } from 'react';
import { $ } from 'meteor/jquery';

const Help = ({ children, collapsed, setCollapsed }) => {
  let collapsedBlock;

  const toggleCollapse = () => {
    $(collapsedBlock).collapse(!collapsed ? 'hide' : 'show');
    setCollapsed(!collapsed);
  };
  
  return (
    <div className="help-info" onClick={toggleCollapse}>
      <button type="button" className="btn btn-link help-icon btn-collapse collapsed">
        <i className="fa fa-question-circle" />
      </button>
      <div
        className="collapse guidance-panel"
        ref={collapsedRef => { collapsedBlock = collapsedRef; }}
      >
        <div className="card-block">
          <div>{children}</div>
          <div className="btn-group">
            <a
              className="btn btn-link guidance-panel-close pointer"
              onClick={toggleCollapse}
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
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};

export default Help;
