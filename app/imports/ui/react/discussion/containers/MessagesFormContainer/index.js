import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';

import { pickFromDiscussion } from '/imports/api/helpers';
import MessagesForm from '../../components/MessagesForm';
import { submit } from './constants.js';

const mapStateToProps = pickFromDiscussion(['messages']);

export default compose(
  connect(mapStateToProps),
  withProps((props) => ({
    disabled: props.standard.isDeleted
  })),
  withHandlers({
    onSubmit: submit
  })
)(MessagesForm);
