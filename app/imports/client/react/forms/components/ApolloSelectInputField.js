import PropTypes from 'prop-types';
import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import SelectInputField from './SelectInputField';

const ApolloSelectInputField = ({ loadOptions, ...props }) => (
  <ApolloConsumer>
    {client => (
      <SelectInputField
        loadOptionsOnOpen
        loadOptions={() => loadOptions(client.query)}
        {...props}
      />
    )}
  </ApolloConsumer>
);

ApolloSelectInputField.propTypes = {
  loadOptions: PropTypes.func.isRequired,
};

export default ApolloSelectInputField;
