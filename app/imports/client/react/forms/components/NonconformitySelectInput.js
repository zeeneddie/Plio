import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';

import { ApolloSelectInputField } from '../../components';
import { Query } from '../../../graphql';

const mapNonconformitiesToOptions = ({ data: { nonconformities: { nonconformities } } }) =>
  mapEntitiesToOptions(nonconformities);

const NonconformitySelectInput = ({
  organizationId,
  transformOptions = mapNonconformitiesToOptions,
  ...props
}) => (
  <ApolloSelectInputField
    {...{ transformOptions, ...props }}
    loadOptions={query => query({
      query: Query.NONCONFORMITY_LIST,
      variables: { organizationId },
    })}
  />
);

NonconformitySelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  transformOptions: PropTypes.func,
};

export default NonconformitySelectInput;
