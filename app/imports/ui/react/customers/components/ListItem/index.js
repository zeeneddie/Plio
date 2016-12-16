import React, { PropTypes } from 'react';

import ListItemLink from '../../../components/ListItemLink';
import ListItem from '../../../components/ListItem';

const CustomersListItem = ({ isActive, onClick, href, name, owner, createdAt }) => (
  <ListItemLink
    isActive={isActive}
    onClick={onClick}
    href={href}
  >
    <ListItem>
      <div className="flexbox-row">
        <ListItem.Heading>
          <span className="margin-right">{name}</span>
        </ListItem.Heading>
      </div>
      <ListItem.LeftText>
        {owner}
      </ListItem.LeftText>
      <ListItem.RightText>
        {createdAt}
      </ListItem.RightText>
    </ListItem>
  </ListItemLink>
);

CustomersListItem.propTypes = {
  href: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  _id: PropTypes.string,
  name: PropTypes.string,
  createdAt: PropTypes.string,
  owner: PropTypes.string,
};

export default CustomersListItem;
