import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import { ActionTypes } from '../../../../share/constants';
import ApolloSelectInputField from './ApolloSelectInputField';

const mapActionsToOptions = ({ data: { actions: { actions } } }) => mapEntitiesToOptions(actions);

const ActionSelectInput = ({
  organizationId,
  transformOptions = mapActionsToOptions,
  type = ActionTypes.GENERAL_ACTION,
  ...props
}) => (
  <ApolloSelectInputField
    {...{ transformOptions, ...props }}
    loadOptions={query => query({
      query: Query.ACTION_LIST,
      variables: { organizationId, type },
    })}
  />
);

ActionSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  type: PropTypes.string,
  transformOptions: PropTypes.func,
};

export default ActionSelectInput;
