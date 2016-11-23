import React, { PropTypes } from 'react';
import cx from 'classnames';

import { Item } from './Item';
import { Title } from './Title';

const CardHeader = ({ children, className }) => (
  <span>
    <div className={cx('card-block', 'card-heading', className)}>
      {children}
    </div>
  </span>
);

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardHeader.Title = Title;
CardHeader.Item = Item;

export default CardHeader;
