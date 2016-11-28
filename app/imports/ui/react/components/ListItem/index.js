import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';
import Heading from './Heading';
import RightText from './RightText';
import LeftText from './LeftText';

const ListItem = ({ className, children }) => (
  <div className={cx(className, 'list-group-item-content')}>
    {children}
  </div>
);

ListItem.Heading = Heading;
ListItem.LeftText = LeftText;
ListItem.RightText = RightText;

ListItem.propTypes = propTypes;

export default ListItem;
