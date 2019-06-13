import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';

import { Query } from '../../../graphql';

import ApolloSelectInputField from './ApolloSelectInputField';

const mapRisksToOptions = ({ data: { risks: { risks } } }) => mapEntitiesToOptions(risks);

const RiskSelectInput = ({
  organizationId,
  transformOptions = mapRisksToOptions,
  ...props
}) => (
  <ApolloSelectInputField
    {...{ transformOptions, ...props }}
    loadOptions={query => query({
      query: Query.RISK_LIST,
      variables: { organizationId },
    })}
  />
);

RiskSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  transformOptions: PropTypes.func,
};

export default RiskSelectInput;
