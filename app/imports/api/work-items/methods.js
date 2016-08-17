import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Method from '../method.js';
import WorkItemService from './work-item-service.js';
import { WorkItemsSchema } from './work-item-schema.js';
import { WorkItems } from './work-items.js';
import { IdSchema } from '../schemas.js';
import { UNAUTHORIZED, CANNOT_RESTORE_NOT_DELETED, WI_CANNOT_RESTORE_ASSIGNED_TO_OTHER } from '../errors.js';
import { checkOrgMembershipByDoc, checkDocExistance, isOrgOwner } from '../checkers.js';
import { chain } from '../helpers.js';

const checkers = function checkers(_id) {
  return chain(checkDocExistance, checkOrgMembershipByDoc)(WorkItems, _id, this.userId);
};

export const updateViewedBy = new Method({
  name: 'WorkItems.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    checkers.call(this, _id);

    return WorkItemService.updateViewedBy({ _id, viewedBy: this.userId });
  }
});

export const remove = new Method({
  name: 'WorkItems.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    // because checkers returns array of the same documents, we simply need the values from the first one
    const [{ isDeleted, organizationId, assigneeId }] = checkers.call(this, _id);

    if (isDeleted) {
      if (!isOrgOwner(userId, organizationId) || assigneeId !== userId) {
        throw ONLY_OWNER_CAN_REMOVE;
      }
    }

    return WorkItemService.remove({ _id, deletedBy: userId });
  }
});

export const restore = new Method({
  name: 'WorkItems.restore',

  validate: IdSchema.validator(),

  run({ _id }) {
    const [{ isDeleted, type, linkedDoc }] = checkers.call(this, _id);

    if (!isDeleted) {
      throw CANNOT_RESTORE_NOT_DELETED;
    }

    // do not allow users to restore deleted items if there is the same not deleted item but assigned to another user
    (function() {
      const doc = WorkItems.findOne({
        type,
        linkedDoc,
        _id: { $ne: _id }
      });

      if (doc) {
        throw WI_CANNOT_RESTORE_ASSIGNED_TO_OTHER;
      }
    })();

    return WorkItemService.restore({ _id });
  }
});
