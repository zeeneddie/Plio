import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import CardHeadingButtons from '../CardHeadingButtons';
import { Pull } from '../Utility';

const ModalHeader = ({
  children,
  className,
  renderLeftButton,
  renderRightButton,
  ...props
}) => (
  <div
    {...props}
    className={cx('card-block card-heading modal-window-heading', className)}
  >
    {renderLeftButton && (
      <Pull left>
        <CardHeadingButtons>
          {renderLeftButton}
        </CardHeadingButtons>
      </Pull>
    )}
    {children}
    {renderRightButton && (
      <Pull right>
        <CardHeadingButtons>
          {renderRightButton}
        </CardHeadingButtons>
      </Pull>
    )}
  </div>
);

ModalHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  renderLeftButton: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  renderRightButton: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
};

export default ModalHeader;
