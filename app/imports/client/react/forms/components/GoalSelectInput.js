import React from 'react';
import PropTypes from 'prop-types';
import { mapRejectedEntitiesByIdsToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import { swal } from '../../../util';

import ApolloSelectInputField from './ApolloSelectInputField';

const GoalSelectInput = ({ organizationId, goalIds = [], ...props }) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Query.GOAL_LIST,
      variables: { organizationId },
    }).then(({ data: { goals: { goals } } }) => ({
      options: mapRejectedEntitiesByIdsToOptions(goalIds, goals),
    })).catch(swal.error)}
  />
);

GoalSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  goalIds: PropTypes.arrayOf(PropTypes.string),
};

export default GoalSelectInput;
