import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';

import { Query } from '../../../graphql';

import ApolloSelectInputField from './ApolloSelectInputField';

const mapGoalsToOptions = ({ data: { goals: { goals } } }) => mapEntitiesToOptions(goals);

const GoalSelectInput = ({
  organizationId,
  transformOptions = mapGoalsToOptions,
  ...props
}) => (
  <ApolloSelectInputField
    {...{ transformOptions, ...props }}
    loadOptions={query => query({
      query: Query.GOAL_LIST,
      variables: { organizationId },
    })}
  />
);

GoalSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  transformOptions: PropTypes.func,
};

export default GoalSelectInput;
