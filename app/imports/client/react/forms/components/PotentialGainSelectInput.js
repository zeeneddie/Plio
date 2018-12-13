import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';

import { ApolloSelectInputField } from '../../components';
import { Query } from '../../../graphql';

const mapPotantialGainsToOptions = ({ data: { potentialGains: { nonconformities } } }) =>
  mapEntitiesToOptions(nonconformities);

const PotentialGainSelectInput = ({
  organizationId,
  transformOptions = mapPotantialGainsToOptions,
  ...props
}) => (
  <ApolloSelectInputField
    {...{ transformOptions, ...props }}
    loadOptions={query => query({
      query: Query.POTENTIAL_GAIN_LIST,
      variables: { organizationId },
    })}
  />
);

PotentialGainSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  transformOptions: PropTypes.func,
};

export default PotentialGainSelectInput;
