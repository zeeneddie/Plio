import React, { PropTypes } from 'react';

import Head from './Head';
import Body from './Body';

const HelpPanel = ({ collapsed, onToggleCollapse, refCb, children }) => (
  <div>
    <Head {...{ collapsed, onToggleCollapse }} />
    <Body {...{ refCb, onToggleCollapse }}>{children}</Body>
  </div>
);

HelpPanel.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  refCb: PropTypes.func,
  children: PropTypes.func.isRequired,
};

HelpPanel.Head = Head;
HelpPanel.Body = Body;

export default HelpPanel;
