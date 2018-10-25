import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import { swal } from '../../../util';

import ApolloSelectInputField from './ApolloSelectInputField';

const GoalSelectInput = ({ organizationId, ...props }) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Query.GOAL_LIST,
      variables: { organizationId },
    }).then(({ data: { goals: { goals } } }) => ({
      options: mapEntitiesToOptions(goals),
    })).catch(swal.error)}
  />
);

GoalSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default GoalSelectInput;
