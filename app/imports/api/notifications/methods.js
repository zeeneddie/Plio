import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import NotificationsService from './notifications-service';
import { Notifications } from '/imports/share/collections/notifications';
import { RequiredSchema } from '/imports/share/schemas/notifications-schema';
import { IdSchema, DocumentIdSchema, DocumentTypeSchema } from '/imports/share/schemas/schemas';
import Method from '../method';
import { checkDocExistance, checkOrgMembership } from '../checkers';
import { getCollectionByDocType } from '/imports/share/helpers';
import { INVALID_DOC_TYPE } from '../errors';
import { DOC_NOT_FOUND_OR_ALREADY_UNSUBSCRIBED } from './errors';
import { checkAndThrow } from '../helpers';
import { Discussions } from '/imports/share/collections/discussions';

export const updateViewedBy = new Method({
  name: 'Notifications.updateViewedBy',

  validate() { IdSchema.validator(); },

  check(checker) {
    return checker(({ _id }) =>
      checkDocExistance(Notifications, { _id, recipientIds: this.userId }));
  },

  run({ _id }) {
    return NotificationsService.updateViewedBy({ _id, userId: this.userId });
  },
});

export const insert = new ValidatedMethod({
  name: 'Notifications.insert',

  validate: RequiredSchema.validator(),

  run({ ...args }) {
    return NotificationsService.insert({ ...args });
  },
});

export const unsubscribe = new Method({
  name: 'Notifications.unsubscribe',

  validate: new SimpleSchema([DocumentIdSchema, DocumentTypeSchema]).validator(),

  check(checker) {
    if (this.isSimulation) return undefined;

    return checker(({ documentId, documentType }) => {
      const collection = getCollectionByDocType(documentType);

      checkAndThrow(!collection, INVALID_DOC_TYPE);

      const query = { _id: documentId, notify: this.userId };

      const doc = collection.findOne(query);

      checkAndThrow(!doc, DOC_NOT_FOUND_OR_ALREADY_UNSUBSCRIBED);

      checkOrgMembership(this.userId, doc.organizationId);

      return { collection };
    });
  },

  run({ documentId, documentType }, { collection } = {}) {
    if (this.isSimulation) return undefined;

    return NotificationsService.unsubscribe({
      documentId,
      documentType,
      userId: this.userId,
    }, {
      collection,
    });
  },
});

export const unsubscribeFromDiscussion = new Method({
  name: 'Notifications.unsubscribeFromDiscussion',

  validate: new SimpleSchema([DocumentIdSchema, DocumentTypeSchema]).validator(),

  check(checker) {
    if (this.isSimulation) return undefined;

    return checker(({ documentId: linkedTo, documentType }) => {
      const query = { linkedTo, documentType, mutedBy: { $ne: this.userId } };
      const doc = Discussions.findOne(query);

      checkAndThrow(!doc, DOC_NOT_FOUND_OR_ALREADY_UNSUBSCRIBED);

      checkOrgMembership(this.userId, doc.organizationId);
    });
  },

  run({ documentId, documentType }) {
    if (this.isSimulation) return undefined;

    return NotificationsService.unsubscribeFromDiscussion({
      documentId,
      documentType,
      userId: this.userId,
    });
  },
});
