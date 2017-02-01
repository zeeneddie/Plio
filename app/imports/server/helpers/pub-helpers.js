import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import property from 'lodash.property';

import { getUserOrganizations } from '../../api/organizations/utils';
import { isOrgMemberBySelector } from '../../api/checkers';

export const getPublishCompositeOrganizationUsersObject = (userId, selector) => ({
  find() {
    return getUserOrganizations(userId, selector);
  },
  children: [
    {
      find({ _id, users = [] }) {
        const userIds = users.map(property('userId'));
        const query = { _id: { $in: userIds } };
        const options = {
          fields: {
            ...Meteor.users.publicFields,
            [`roles.${_id}`]: 1,
          },
        };

        return Meteor.users.find(query, options);
      },
    },
  ],
});

export const getPublishCompositeOrganizationUsers = (fn) =>
  function publishCompositeOrganizationUsers(serialNumber, isDeleted = { $in: [null, false] }) {
    check(serialNumber, Number);
    check(isDeleted, Match.OneOf(Boolean, { $in: Array })); // eslint-disable-line new-cap

    const userId = this.userId;

    if (!userId || !isOrgMemberBySelector(userId, { serialNumber })) {
      return this.ready();
    }

    const pubObj = getPublishCompositeOrganizationUsersObject(userId, { serialNumber });
    const pubData = typeof fn === 'function' && fn.call(this, userId, serialNumber, isDeleted);
    const children = Object.assign([], pubObj.children).concat(Object.assign([], pubData));

    return Object.assign({}, pubObj, { children });
  };
