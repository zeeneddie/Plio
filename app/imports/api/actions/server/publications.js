import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Actions } from '/imports/share/collections/actions.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';
import { getActionFiles, createActionCardPublicationTree } from '../utils';

Meteor.publishComposite('actionsList', function (
  organizationId,
  isDeleted = { $in: [null, false] }
) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Actions.find({
        organizationId,
        isDeleted,
      }, {
        fields: Actions.publicFields,
      });
    },
  };
});

Meteor.publishComposite('actionCard', function ({ _id, organizationId }) {
  check(_id, String);
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return createActionCardPublicationTree(() => ({ _id, organizationId }));
});

Meteor.publishComposite('actionsByIds', function (ids = []) {
  return {
    find() {
      let query = {
        _id: { $in: ids },
        isDeleted: { $in: [null, false] },
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
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Actions.find({
    organizationId,
    isDeleted: { $in: [false, null] },
  }));
});

Meteor.publish('actionsNotViewedCount', function (counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Actions.find({
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] },
  }));
});
