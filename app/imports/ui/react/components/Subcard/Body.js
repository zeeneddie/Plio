import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';
import cx from 'classnames';

const SubcardBody = ({
  children,
  isOpen,
  className,
  ...props
}) => (
  <Collapse
    className={cx('card-block-collapse collapse', className)}
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
