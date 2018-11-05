import React from 'react';
import PropTypes from 'prop-types';
import { mapRejectedEntitiesByIdsToOptions } from 'plio-util';

import { swal } from '../../../util';
import { ApolloSelectInputField } from '../../components';
import { Query } from '../../../graphql';

const PotentialGainSelectInput = ({
  organizationId,
  potentialGainIds = [],
  ...props
}) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Query.POTENTIAL_GAIN_LIST,
      variables: { organizationId },
    }).then(({ data: { potentialGains: { nonconformities } } }) => ({
      options: mapRejectedEntitiesByIdsToOptions(potentialGainIds, nonconformities),
    })).catch(swal.error)}
  />
);

PotentialGainSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  potentialGainIds: PropTypes.array,
};

export default PotentialGainSelectInput;
