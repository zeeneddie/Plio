import { connect } from 'react-redux';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { Meteor } from 'meteor/meteor';

import MessagesForm from '../../components/MessagesForm';
import { submit } from './handlers';

export default compose(
  connect(),
  withState('value', 'setValue', ''),
  withProps((props) => ({
    disabled: !props.doc || props.doc.isDeleted,
    users: Meteor.users.find().map((user) => ({
      text: user.fullNameOrEmail(),
      value: user._id,
      email: user.emails[0].address,
    })),
  })),
  withHandlers({
    onSubmit: submit,
  }),
)(MessagesForm);
