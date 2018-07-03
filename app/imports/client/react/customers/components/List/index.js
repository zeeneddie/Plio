import React from 'react';

import CustomersListItemContainer from '../../containers/ListItemContainer';
import propTypes from './propTypes';

const CustomersList = props => (
  <div className="list-group">
    {props.organizations.map(organization => (
      <CustomersListItemContainer
        key={organization._id}
        urlItemId={props.urlItemId}
        {...organization}
      />
    ))}
  </div>
);

CustomersList.propTypes = propTypes;

export default CustomersList;
