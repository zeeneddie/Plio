import PropTypes from 'prop-types';
import React from 'react';
import { mapUsersToOptions } from 'plio-util';
import { pluck, compose, identity } from 'ramda';

import { Query as Queries } from '../../../graphql';
import ApolloSelectInputField from './ApolloSelectInputField';

const UserSelectInput = ({ organizationId, transformOptions, ...props }) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Queries.ORGANIZATION_USERS,
      variables: { organizationId },
    })}
    transformOptions={({ data: { organization: { users } } }) =>
      compose(transformOptions, mapUsersToOptions, pluck('user'))(users)}
  />
);

UserSelectInput.defaultProps = {
  transformOptions: identity,
};

UserSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  transformOptions: PropTypes.func,
};

export default UserSelectInput;
