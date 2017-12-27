import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { CardBlock } from '../';

const SubcardHeader = ({
  children,
  className,
  isOpen,
  isNew,
  error,
  ...props
}) => (
  <CardBlock
    className={cx(
      'card-block-collapse-toggle',
      className,
      {
        'with-error': error,
        new: isNew,
        collapsed: !isOpen,
      },
    )}
    {...props}
  >
    {children}
  </CardBlock>
);

SubcardHeader.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  className: PropTypes.string,
  isNew: PropTypes.bool,
  error: PropTypes.bool,
};

export default SubcardHeader;
