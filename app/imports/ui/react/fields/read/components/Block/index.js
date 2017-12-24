import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, ListGroup, CardTitle } from 'reactstrap';
import cx from 'classnames';

const Block = ({
  wrapper,
  heading: { className: headingCx, ...heading } = {},
  title,
  listGroup,
  children,
}) => (
  <div {...wrapper}>
    <CardBody className={cx('card-subheading card-block', headingCx)} {...heading}>
      <CardTitle {...title}>{children[0]}</CardTitle>
    </CardBody>

    <ListGroup {...listGroup}>
      {children[1]}
    </ListGroup>
  </div>
);

Block.propTypes = {
  wrapper: PropTypes.object,
  heading: PropTypes.object,
  title: PropTypes.object,
  listGroup: PropTypes.object,
  children: PropTypes.node,
};

export default Block;
