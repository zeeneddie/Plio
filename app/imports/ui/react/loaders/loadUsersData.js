import { Meteor } from 'meteor/meteor';
import { batchActions } from 'redux-batched-actions';

import { setUsers, setUsersByOrgIds } from '/imports/client/store/actions/collectionsActions';

export default function loadUsersData({ dispatch }, onData = () => null) {
  const users = Meteor.users.find().fetch();

  const actions = [
    setUsers(users),
    setUsersByOrgIds(true), // note that 'setOrganizations' should be called earlier
  ];

  dispatch(batchActions(actions));

  onData(null, {});
}

