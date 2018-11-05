import React from 'react';
import PropTypes from 'prop-types';
import { mapRejectedEntitiesByIdsToOptions } from 'plio-util';

import { swal } from '../../../util';
import { ApolloSelectInputField } from '../../components';
import { Query } from '../../../graphql';

const NonconformitySelectInput = ({
  organizationId,
  nonconformityIds = [],
  ...props
}) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Query.NONCONFORMITY_LIST,
      variables: { organizationId },
    }).then(({ data: { nonconformities: { nonconformities } } }) => ({
      options: mapRejectedEntitiesByIdsToOptions(nonconformityIds, nonconformities),
    })).catch(swal.error)}
  />
);

NonconformitySelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  nonconformityIds: PropTypes.array,
};

export default NonconformitySelectInput;
