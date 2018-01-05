import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import QuestionMarkButton from '../../Buttons/QuestionMarkButton';

const FormLabel = ({
  colXs = 12, colSm = 4, helpText, collapsed, onToggleCollapse, children,
}) => (
  <label className={`form-control-label col-xs-${colXs} col-sm-${colSm}`}>
    {!!helpText && (
      <QuestionMarkButton
        className={cx('help-icon', { collapsed })}
        onClick={onToggleCollapse}
      />
    )}
    {children}
  </label>
);

FormLabel.propTypes = {
  colXs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  colSm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  helpText: PropTypes.string,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  children: PropTypes.node,
};

export default FormLabel;
