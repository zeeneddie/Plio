import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

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

export default CardHeader;
