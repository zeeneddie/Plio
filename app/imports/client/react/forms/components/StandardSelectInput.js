import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import ApolloSelectInputField from './ApolloSelectInputField';

const mapStandardsToOptions = ({ data: { standards: { standards } } }) =>
  mapEntitiesToOptions(standards);

const StandardSelectInput = ({
  onLink,
  onUnlink,
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
    onSelect={onLink && (({ value }) => onLink(value))}
    onDelete={onUnlink && (({ value }) => onUnlink(value))}
  />
);

StandardSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
  transformOptions: PropTypes.func,
};

export default StandardSelectInput;
