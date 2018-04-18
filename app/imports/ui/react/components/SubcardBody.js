import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Collapse from './Collapse';

const SubcardBody = ({
  children,
  isOpen,
  className,
  ...props
}) => (
  <Collapse
    className={cx(
      className,
      'card-block-collapse',
    )}
    {...{ isOpen, ...props }}
  >
    {children}
  </Collapse>
);

SubcardBody.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default SubcardBody;
