import React from 'react';

import propTypes from './propTypes';
import Heading from './Heading';
import RightText from './RightText';
import LeftText from './LeftText';

const ListItem = ({ className, children }) => (
  <div className={className}>
    <div className="list-group-item-content">
      {children}
    </div>
  </div>
);

ListItem.Heading = Heading;
ListItem.LeftText = LeftText;
ListItem.RightText = RightText;

ListItem.propTypes = propTypes;

export default ListItem;
