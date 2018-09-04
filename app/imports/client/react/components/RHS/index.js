import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import RHSCard from './RHSCard';
import RHSHeader from './RHSHeader';
import RHSContentList from './RHSContentList';

const RHS = ({
  className,
  children,
  flex,
}) => (
  <div className={cx('content-cards-inner', { flex }, className)}>
    {children}
  </div>
);

RHS.propTypes = {
  className: PropTypes.string,
  flex: PropTypes.bool,
  children: PropTypes.node,
};

RHS.Card = RHSCard;
RHS.Header = RHSHeader;
RHS.ContentList = RHSContentList;

export default RHS;
