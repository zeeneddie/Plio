import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Actions } from '/imports/share/collections/actions';
import { isOrgMember } from '../../checkers';
import Counter from '../../counter/server';
import { getActionFiles, createActionCardPublicationTree } from '../utils';


Meteor.publishComposite('actionCard', function ({ _id, organizationId }) {
  check(_id, String);
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return createActionCardPublicationTree(() => ({ _id, organizationId }));
});

Meteor.publishComposite('actionsByIds', (ids = []) => {
  check(ids, [String]);

  return {
    find() {
      let query = {
        _id: { $in: ids },
        isDeleted: false,
      };

      const { organizationId } = Object.assign({}, Actions.findOne(query));
      const userId = this.userId;

      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      query = { ...query, organizationId };

      return Actions.find(query);
    },
    children: [{
      find(action) {
        return getActionFiles(action);
      },
    }],
  };
});

Meteor.publish('actionsCount', function (counterName, organizationId) {
  check(counterName, String);
  check(organizationId, String);

  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Actions.find({
    organizationId,
    isDeleted: false,
  }));
});

Meteor.publish('actionsNotViewedCount', function (counterName, organizationId) {
  check(counterName, String);
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Actions.find({
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: false,
  }));
});
