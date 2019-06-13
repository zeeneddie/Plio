import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import ApolloSelectInputField from './ApolloSelectInputField';

const mapStandardsToOptions = ({ data: { standards: { standards } } }) =>
  mapEntitiesToOptions(standards);

const StandardSelectInput = ({
  organizationId,
  transformOptions = mapStandardsToOptions,
  ...props
}) => (
  <ApolloSelectInputField
    {...{ transformOptions, ...props }}
    loadOptions={query => query({
      query: Query.STANDARD_LIST,
      variables: { organizationId },
    })}
  />
);

StandardSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  transformOptions: PropTypes.func,
};

export default StandardSelectInput;
