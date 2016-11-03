import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';

import MessagesForm from '../../components/MessagesForm';
import { submit } from './handlers';

export default compose(
  connect(),
  withProps((props) => ({
    disabled: props.standard.isDeleted
  })),
  withHandlers({
    onSubmit: submit
  })
)(MessagesForm);
