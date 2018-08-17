import { connect } from 'react-redux';
import { compose, withHandlers, withProps, withState } from 'recompose';

import { submit } from './handlers';
import MessagesForm from '../../components/MessagesForm';
import { getId } from '/imports/api/helpers';
import {
  isCompletedRegistration,
  getFullName,
  getAvatar,
  getEmail,
} from '/imports/api/users/helpers';

export default compose(
  connect((state, { organizationId }) => ({
    users: state.collections.usersByOrgIds[organizationId],
  })),
  withProps(({ doc, users }) => {
    const mapper = user => ({
      value: getId(user),
      text: getFullName(user),
      email: getEmail(user),
      avatar: getAvatar(user),
    });
    const usersMapped = users.filter(isCompletedRegistration).map(mapper);

    return {
      users: usersMapped,
      disabled: !doc || doc.isDeleted,
    };
  }),
  withState('value', 'setValue', ''),
  withHandlers({
    onSubmit: submit,
  }),
)(MessagesForm);
