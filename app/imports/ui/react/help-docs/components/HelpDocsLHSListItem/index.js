import React from 'react';

import ListItemLink from '../../../components/ListItemLink';
import ListItem from '../../../components/ListItem';
import propTypes from './propTypes';

const HelpsLHSListItem = (props) => (
  <ListItemLink
    isActive={props.isActive}
    onClick={props.onClick}
    href={props.href}
  >
    <ListItem>
      <ListItem.Heading>
        <span>{props.title}</span>
      </ListItem.Heading>
    </ListItem>
  </ListItemLink>
);

HelpsLHSListItem.propTypes = propTypes;

export default HelpsLHSListItem;
