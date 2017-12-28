import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { Collapse, CardBlock, Icon } from '../';

const ErrorSection = ({ errorText, size = '4', className }) => (
  <Collapse className={cx('modal-error-section', className)} isOpen={!!errorText}>
    <CardBlock>
      <Icon {...{ size }} name="exclamation-circle" aria-hidden="true" />
      {errorText}
    </CardBlock>
  </Collapse>
);

ErrorSection.propTypes = {
  errorText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  size: PropTypes.string,
  className: PropTypes.string,
};

export default ErrorSection;
