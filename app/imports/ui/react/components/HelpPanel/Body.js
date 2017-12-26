import PropTypes from 'prop-types';
import React from 'react';

import Button from '../Buttons/Button';
import Collapse from '../Collapse';

const HelpPanelBody = ({ onToggleCollapse, collapsed, children }) => (
  <Collapse
    isOpen={!collapsed}
    className="collapse guidance-panel"
  >
    <div className="card-block">
      <div>{children}</div>
      <div className="btn-group">
        <Button
          component="button"
          color="link"
          className="guidance-panel-close pointer"
          onClick={onToggleCollapse}
        >
          Close
        </Button>
      </div>
    </div>
  </Collapse>
);

HelpPanelBody.propTypes = {
  refCb: PropTypes.func,
  onToggleCollapse: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default HelpPanelBody;
