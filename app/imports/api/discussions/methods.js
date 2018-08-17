import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Method, { CheckedMethod } from '../method';
import DiscussionsService from './discussions-service';
import {
  idSchemaDoc,
  DocumentIdSchema,
  DocumentTypeSchema,
  IdSchema,
} from '../../share/schemas/schemas';
import { inject, chain, checkAndThrow } from '../helpers';
import { Discussions, Organizations } from '../../share/collections';
import {
  DSC_OnUpdateViewedByChecker,
  checkDocExistance,
  checkOrgMembership,
} from '../checkers';
import { DOC_NOT_FOUND_OR_ALREADY_UNSUBSCRIBED } from '../notifications/errors';

const injectDSC = inject(Discussions);

export const updateViewedByDiscussion = new CheckedMethod({
  name: 'Discussions.viewedBy.updateByDiscussion',

  validate: new SimpleSchema({
    _id: idSchemaDoc,
    messageId: idSchemaDoc,
  }).validator(),

  check: checker => injectDSC(checker)(DSC_OnUpdateViewedByChecker),

  run({ _id, messageId }) {
    return DiscussionsService.updateViewedByDiscussion({
      _id,
      messageId,
      userId: this.userId,
    });
  },
});

export const updateViewedByOrganization = new Method({
  name: 'Discussions.viewedBy.updateByOrganization',

  validate: new SimpleSchema({
    _id: idSchemaDoc,
  }).validator(),

  check(checker) {
    return checker(({ _id }) => chain(
      checkDocExistance(Organizations, _id),
      checkOrgMembership(this.userId, _id),
    ));
  },

  run({ _id }) {
    return DiscussionsService.updateViewedByOrganization({
      _id,
      userId: this.userId,
    });
  },
});

export const unsubscribe = new Method({
  name: 'Discussions.unsubscribe',

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

    return DiscussionsService.unsubscribe({
      documentId,
      documentType,
      userId: this.userId,
    });
  },
});

export const toggleMute = new Method({
  name: 'Discussions.toggleMute',

  validate: IdSchema.validator(),

  check(checker) {
    return checker(({ _id }) => {
      const doc = checkDocExistance(Discussions, { _id });

      checkOrgMembership(this.userId, doc.organizationId);

      return { doc };
    });
  },

  run({ _id }, { doc } = {}) {
    return DiscussionsService.toggleMute({
      _id,
      userId: this.userId,
    }, { doc });
  },
});
