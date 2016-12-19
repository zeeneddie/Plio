import React, { PropTypes } from 'react';

import Button from '../Buttons/Button';

const HelpPanelBody = ({ refCb, onToggleCollapse, children }) => (
  <div className="collapse guidance-panel" ref={refCb}>
    <div className="card-block">
      {children}
      <div className="btn-group">
        <Button
          type="link"
          className="guidance-panel-close pointer"
          onClick={onToggleCollapse}
        >
          Close
        </Button>
      </div>
    </div>
  </div>
);

HelpPanelBody.propTypes = {
  refCb: PropTypes.func,
  onToggleCollapse: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default HelpPanelBody;
