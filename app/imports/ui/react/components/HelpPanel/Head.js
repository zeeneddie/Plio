import React, { PropTypes } from 'react';
import cx from 'classnames';

import Button from '../Buttons/Button';
import Icon from '../Icon';

const HelpPanelHead = ({ collapsed, onToggleCollapse }) => (
  <Button
    type="link"
    className={cx('btn-icon guidance-panel-open', { collapsed })}
    onClick={onToggleCollapse}
  >
    <Icon names="question-circle" />
  </Button>
);

HelpPanelHead.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default HelpPanelHead;
