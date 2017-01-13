import { connect } from 'react-redux';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { Meteor } from 'meteor/meteor';
import property from 'lodash.property';

import { Organizations } from '/imports/share/collections/organizations';
import { submit } from './handlers';
import MessagesForm from '../../components/MessagesForm';

export default compose(
  connect(),
  withState('value', 'setValue', ''),
  withProps(({ doc, organizationId }) => {
    const organization = { ...Organizations.findOne({ _id: organizationId }) };
    const query = { $and: [
      { _id: { $ne: Meteor.userId() } },
      { _id: { $in: [...organization.users.map(property('userId'))] } },
    ] };
    const users = Meteor.users.find(query).map((user) => ({
      text: user.fullNameOrEmail(),
      value: user._id,
      email: user.emails[0].address,
      avatar: user.avatar(),
    }));

    return {
      users,
      disabled: !doc || doc.isDeleted,
    };
  }),
  withHandlers({
    onSubmit: submit,
  }),
)(MessagesForm);
