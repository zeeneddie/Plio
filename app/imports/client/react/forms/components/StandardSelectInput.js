import React from 'react';
import PropTypes from 'prop-types';
import { mapRejectedEntitiesByIdsToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import { swal } from '../../../util';

import ApolloSelectInputField from './ApolloSelectInputField';

const StandardSelectInput = ({ organizationId, standardIds = [], ...props }) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Query.STANDARD_LIST,
      variables: { organizationId },
    }).then(({ data: { standards: { standards } } }) => ({
      options: mapRejectedEntitiesByIdsToOptions(standardIds, standards),
    })).catch(swal.error)}
  />
);

StandardSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  standardIds: PropTypes.arrayOf(PropTypes.string),
};

export default StandardSelectInput;
