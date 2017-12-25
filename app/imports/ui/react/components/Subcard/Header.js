import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { CardBlock } from '../';

const SubcardHeader = ({
  children,
  className,
  isOpen,
  ...props
}) => (
  <CardBlock
    className={cx('card-block-collapse-toggle', className, { collapsed: !isOpen })}
    {...props}
  >
    {children}
  </CardBlock>
);

SubcardHeader.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  className: PropTypes.string,
};

export default SubcardHeader;
