import PropTypes from 'prop-types';
import React from 'react';
import { mapUsersToOptions } from 'plio-util';
import { pluck, compose, identity } from 'ramda';

import { swal } from '../../../util';
import { Query as Queries } from '../../../graphql';
import ApolloSelectInputField from './ApolloSelectInputField';

const UserSelectInput = ({ organizationId, transform, ...props }) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Queries.ORGANIZATION_USERS,
      variables: { organizationId },
    }).then(({ data: { organization: { users } } }) => ({
      options: compose(transform, mapUsersToOptions, pluck('user'))(users),
    })).catch(swal.error)}
  />
);

UserSelectInput.defaultProps = {
  transform: identity,
};

UserSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  transform: PropTypes.func,
};

export default UserSelectInput;
