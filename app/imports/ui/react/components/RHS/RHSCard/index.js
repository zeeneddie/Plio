import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const RHSCard = ({ className, children }) => (
  <div className={cx(className, 'card')}>{children}</div>
);

RHSCard.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default RHSCard;
