import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { MessagesSchema } from '/imports/share/schemas/messages-schema';
import { Messages } from '/imports/share/collections/messages';
import { Discussions } from '/imports/share/collections/discussions';
import { IdSchema } from '/imports/share/schemas/schemas';
import { getCollectionByDocType } from '/imports/share/helpers';
import { MessageService } from '../../share/services';
import { checkDocExistance, checkOrgMembership } from '../checkers';
import { CANNOT_CREATE_MESSAGE_FOR_DELETED, ONLY_OWNER_CAN_UPDATE } from '../errors';

const onInsertCheck = ({ discussionId }) => {
  const { linkedTo, documentType } = checkDocExistance(Discussions, { _id: discussionId });

  const { isDeleted } = checkDocExistance(getCollectionByDocType(documentType), { _id: linkedTo });

  if (isDeleted) {
    throw CANNOT_CREATE_MESSAGE_FOR_DELETED;
  }

  return true;
};

const onUpdateCheck = ({ _id, userId }) => {
  const { createdBy, organizationId } = checkDocExistance(Messages, { _id });

  if (userId !== createdBy) {
    throw ONLY_OWNER_CAN_UPDATE;
  }

  checkOrgMembership(userId, organizationId);
  return true;
};

export const insert = new ValidatedMethod({
  name: 'Mesages.insert',

  validate: MessagesSchema.validator(),

  run({ ...args }) {
    const { userId } = this;

    if (!userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot add messages to discussions');
    }

    checkOrgMembership(userId, args.organizationId);
    onInsertCheck({ ...args });
    return MessageService.insert({ ...args }, { userId });
  },
});

export const remove = new ValidatedMethod({
  name: 'Messages.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const { userId } = this;

    if (!userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot remove messages from discussions');
    }

    onUpdateCheck({ _id, userId });
    return MessageService.remove({ _id });
  },
});
