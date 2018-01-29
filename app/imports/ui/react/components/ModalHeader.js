import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import CardHeadingButtons from './CardHeadingButtons';
import { Pull } from './Utility';

const ModalHeader = ({
  children,
  className,
  renderLeftButton,
  renderRightButton,
  ...props
}) => (
  <div
    className={cx('card-block card-heading modal-window-heading', className)}
    {...props}
  >
    {renderLeftButton && (
      <Pull left>
        <CardHeadingButtons>
          {renderLeftButton(props)}
        </CardHeadingButtons>
      </Pull>
    )}
    {children}
    {renderRightButton && (
      <Pull right>
        <CardHeadingButtons>
          {renderRightButton(props)}
        </CardHeadingButtons>
      </Pull>
    )}
  </div>
);

ModalHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  renderLeftButton: PropTypes.func,
  renderRightButton: PropTypes.func,
};

export default ModalHeader;
