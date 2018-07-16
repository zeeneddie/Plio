import PropTypes from 'prop-types';
import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { mapUsersToOptions } from 'plio-util';
import { pluck, compose } from 'ramda';

import { Query as Queries } from '../../../graphql';
import SelectInputField from './SelectInputField';

const UserSelectInput = ({ organizationId, ...props }) => (
  <ApolloConsumer>
    {client => (
      <SelectInputField
        loadOptionsOnOpen
        loadOptions={() => client.query({
          query: Queries.ORGANIZATION_USERS,
          variables: { organizationId },
        }).then(({ data: { organization: { users } } }) => ({
          options: compose(mapUsersToOptions, pluck('user'))(users),
        }))}
        {...props}
      />
    )}
  </ApolloConsumer>
);

UserSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default UserSelectInput;
