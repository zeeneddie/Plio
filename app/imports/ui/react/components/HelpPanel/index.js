import PropTypes from 'prop-types';
import React from 'react';

import Head from './Head';
import Body from './Body';

const HelpPanel = ({
  collapsed, onToggleCollapse, refCb, showIconAlways, children,
}) => (
  <div>
    <Head {...{ onToggleCollapse, collapsed: showIconAlways ? true : collapsed }} />
    <Body {...{ refCb, collapsed, onToggleCollapse }}>{children}</Body>
  </div>
);

HelpPanel.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  showIconAlways: PropTypes.bool,
  refCb: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.node]).isRequired,
};

HelpPanel.Head = Head;
HelpPanel.Body = Body;

export default HelpPanel;
