import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MessagesSchema } from './messages-schema';
import MessagesService from './messages-service.js';
import DiscussionsService from '/imports/api/discussions/discussions-service.js';
import { Discussions } from '../discussions/discussions.js';
import { IdSchema, UserIdSchema, DiscussionIdSchema, optionsSchema } from '../schemas.js';
import { checkDocExistance, checkOrgMembership } from '../checkers.js';
import { getCollectionByDocType } from '../helpers.js';
import { CANNOT_CREATE_MESSAGE_FOR_DELETED, ONLY_OWNER_CAN_UPDATE } from './errors.js';

const onInsertCheck = ({ discussionId }) => {
	const { linkedTo, documentType } = checkDocExistance({ _id: discussionId }, Discussions);

	const { isDeleted, organizationId } = checkDocExistance({ _id: linkedTo }, getCollectionByDocType(documentType));

	if (isDeleted) {
		throw CANNOT_CREATE_MESSAGE_FOR_DELETED;
	};

	return true;
};

onUpdateCheck = ({ _id, userId }) => {
	const { createdBy } = checkDocExistance({ _id }, Messages);

	if (userId !== createdBy) {
		throw ONLY_OWNER_CAN_UPDATE;
	}

	return true;
};

export const addMessage = new ValidatedMethod({
	name: 'Mesages.addMessage',
	validate: MessagesSchema.validator(),

	run({ ...args }) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot add messages to discussions'
			);
		}

		onInsertCheck({ ...args });

		return MessagesService.insert({ ...args });
	}
});

export const update = new ValidatedMethod({
  name: 'Messages.update',

  validate: new SimpleSchema([
    IdSchema, optionsSchema //, MessageUpdateSchema
  ]).validator(),

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a message'
      );
    }

		onUpdateCheck({ ...args, userId });

    return MessagesService.update({ ...args });
  }
});

export const updateViewedBy = new ValidatedMethod({
	name: 'Messages.updateViewedBy',
	validate: IdSchema.validator(),

	run({ _id }) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot update a message'
			);
		}

		return MessagesService.updateViewedBy({ _id, userId });
	}
});

export const bulkUpdateViewedBy = new ValidatedMethod({
	name: 'Messages.bulkUpdateViewedBy',
	validate: DiscussionIdSchema.validator(),

	run({ discussionId }) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot update a message'
			);
		}

		return MessagesService.bulkUpdateViewedBy({ discussionId, userId });
	}
});

export const removeMessageById = new ValidatedMethod({
	name: 'Messages.removeMessageById',
	validate: new SimpleSchema([IdSchema]).validator(),

	run({ _id }) {
		if (!this.userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot remove messages from discussions'
			);
		}

		onUpdateCheck({ _id });

		return MessagesService.remove({ _id });
	}
});
