import React from 'react';

import propTypes from './propTypes';
import ListItemLink from '../../../components/ListItemLink';
import ListItem from '../../../components/ListItem';

const CustomersListItem = (props) => (
  <ListItemLink
    isActive={props.isActive}
    onClick={props.onClick}
    href={props.href}
  >
    <ListItem>
      <div className="flexbox-row">
        <ListItem.Heading>
          <span className="margin-right">{props.orgName}</span>
        </ListItem.Heading>
      </div>
      <ListItem.LeftText>
        {props.orgOwner}
      </ListItem.LeftText>
      <ListItem.RightText>
        {props.orgCreatedAt}
      </ListItem.RightText>
    </ListItem>
  </ListItemLink>
);

CustomersListItem.propTypes = propTypes;

export default CustomersListItem;
