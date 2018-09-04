import PropTypes from 'prop-types';
import React from 'react';
import { mapUsersToOptions } from 'plio-util';
import { pluck, compose } from 'ramda';

import { swal } from '../../../util';
import { Query as Queries } from '../../../graphql';
import ApolloSelectInputField from './ApolloSelectInputField';

const UserSelectInput = ({ organizationId, ...props }) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Queries.ORGANIZATION_USERS,
      variables: { organizationId },
    }).then(({ data: { organization: { users } } }) => ({
      options: compose(mapUsersToOptions, pluck('user'))(users),
    })).catch(swal.error)}
  />
);

UserSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default UserSelectInput;
