import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import QuestionMarkButton from '../Buttons/QuestionMarkButton';

const HelpPanelHead = ({ collapsed, onToggleCollapse }) => (
  <QuestionMarkButton
    className={cx('btn-icon guidance-panel-open', { collapsed })}
    onClick={onToggleCollapse}
  />
);

HelpPanelHead.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default HelpPanelHead;
