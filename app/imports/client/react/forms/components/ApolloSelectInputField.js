import PropTypes from 'prop-types';
import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { identity } from 'ramda';

import { swal } from '../../../util';
import { renderComponent } from '../../helpers';
import SelectInputField from './SelectInputField';

const ApolloSelectInputField = ({
  loadOptions,
  transformOptions,
  onError,
  ...props
}) => (
  <ApolloConsumer>
    {client => renderComponent({
      loadOptionsOnOpen: true,
      loadOptions: () => loadOptions(client.query)
        .then((...args) => ({ options: transformOptions(...args) }))
        .catch(onError),
      ...props,
    })}
  </ApolloConsumer>
);

ApolloSelectInputField.defaultProps = {
  component: SelectInputField,
  transformOptions: identity,
  onError: swal.error,
};

ApolloSelectInputField.propTypes = {
  loadOptions: PropTypes.func.isRequired,
  transformOptions: PropTypes.func,
  component: PropTypes.func,
  onError: PropTypes.func,
};

export default ApolloSelectInputField;
