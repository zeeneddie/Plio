import React, { PropTypes } from 'react';
import cx from 'classnames';

const RHSCard = ({ className, children }) => (
  <div className={cx(className, 'card')}>{children}</div>
);

RHSCard.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default RHSCard;
