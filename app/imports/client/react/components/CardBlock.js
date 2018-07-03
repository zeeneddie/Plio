import React from 'react';
import PropTypes from 'prop-types';
import { CardBody } from 'reactstrap';
import cx from 'classnames';

const CardBlock = ({ className, children, ...props }) => (
  <CardBody className={cx('card-block', className)} {...props}>
    {children}
  </CardBody>
);

CardBlock.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default CardBlock;
