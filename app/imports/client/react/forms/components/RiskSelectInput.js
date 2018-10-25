import React from 'react';
import PropTypes from 'prop-types';
import { mapRejectedEntitiesToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import { swal } from '../../../util';

import ApolloSelectInputField from './ApolloSelectInputField';

const RiskSelectInput = ({ organizationId, risks, ...props }) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Query.RISK_LIST,
      variables: { organizationId },
    }).then(({ data: { risks: { risks: resultRisks } } }) => ({
      options: mapRejectedEntitiesToOptions(risks, resultRisks),
    })).catch(swal.error)}
  />
);

RiskSelectInput.defaultProps = {
  without: [],
};

RiskSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  without: PropTypes.arrayOf(PropTypes.string),
  risks: PropTypes.arrayOf(PropTypes.object),
};

export default RiskSelectInput;
