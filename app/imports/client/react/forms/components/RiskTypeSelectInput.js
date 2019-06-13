import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import ApolloSelectInputField from './ApolloSelectInputField';

const mapRiskTypesToOptions = ({ data: { riskTypes: { riskTypes } } }) =>
  mapEntitiesToOptions(riskTypes);

const RiskTypeSelectInput = ({
  organizationId,
  transformOptions = mapRiskTypesToOptions,
  ...props
}) => (
  <ApolloSelectInputField
    {...{ transformOptions, ...props }}
    loadOptions={query => query({
      query: Query.RISK_TYPE_LIST,
      variables: { organizationId },
      fetchPolicy: ApolloFetchPolicies.NETWORK_ONLY,
    })}
  />
);

RiskTypeSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  transformOptions: PropTypes.func,
};

export default RiskTypeSelectInput;
