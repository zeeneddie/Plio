import React, { PropTypes } from 'react';
import Collapse from '/imports/ui/react/components/Collapse';

const Help = ({ children, collapsed, setCollapsed }) => {
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <div className="help-info" onClick={toggleCollapse}>

      <Collapse
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        classNames={{ body: 'collapse guidance-panel', head: '' }}
      >
        <button type="button" className="btn btn-link help-icon btn-collapse">
          <i className="fa fa-question-circle" />
        </button>
        <div>
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
      </Collapse>
    </div>
  );
};

Help.propTypes = {
  children: PropTypes.node,
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};

export default Help;
