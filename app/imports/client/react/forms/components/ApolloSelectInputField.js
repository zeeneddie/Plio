import PropTypes from 'prop-types';
import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import { renderComponent } from '../../helpers';
import SelectInputField from './SelectInputField';

const ApolloSelectInputField = ({ loadOptions, ...props }) => (
  <ApolloConsumer>
    {client => renderComponent({
      loadOptionsOnOpen: true,
      loadOptions: () => loadOptions(client.query),
      ...props,
    })}
  </ApolloConsumer>
);

ApolloSelectInputField.defaultProps = {
  component: SelectInputField,
};

ApolloSelectInputField.propTypes = {
  loadOptions: PropTypes.func.isRequired,
  component: PropTypes.func,
};

export default ApolloSelectInputField;
