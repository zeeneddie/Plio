import React from 'react';
import PropTypes from 'prop-types';
import { mapRejectedEntitiesByIdsToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import { swal } from '../../../util';

import ApolloSelectInputField from './ApolloSelectInputField';

const RiskSelectInput = ({ organizationId, riskIds, ...props }) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Query.RISK_LIST,
      variables: { organizationId },
    }).then(({ data: { risks: { risks } } }) => ({
      options: mapRejectedEntitiesByIdsToOptions(riskIds, risks),
    })).catch(swal.error)}
  />
);

RiskSelectInput.defaultProps = {
  without: [],
  riskIds: [],
};

RiskSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  without: PropTypes.arrayOf(PropTypes.string),
  riskIds: PropTypes.arrayOf(PropTypes.string),
};

export default RiskSelectInput;
