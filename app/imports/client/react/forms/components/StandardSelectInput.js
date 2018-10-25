import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import { swal } from '../../../util';

import ApolloSelectInputField from './ApolloSelectInputField';

const StandardSelectInput = ({ organizationId, ...props }) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Query.STANDARD_LIST,
      variables: { organizationId },
    }).then(({ data: { standards: { standards } } }) => ({
      options: mapEntitiesToOptions(standards),
    })).catch(swal.error)}
  />
);

StandardSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default StandardSelectInput;
