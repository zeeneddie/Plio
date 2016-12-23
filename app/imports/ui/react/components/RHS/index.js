import React, { PropTypes } from 'react';
import cx from 'classnames';

import RHSCard from './RHSCard';
import RHSHeader from './RHSHeader';

const RHS = ({
  className,
  children,
}) => (
  <div className={cx(className, 'content-cards-inner flex')}>
    {children}
  </div>
);

RHS.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

RHS.Card = RHSCard;
RHS.Header = RHSHeader;

export default RHS;
