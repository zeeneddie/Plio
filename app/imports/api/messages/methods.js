import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MessagesSchema } from './messages-schema.js';
import { Messages } from './messages.js';
import MessagesService from './messages-service.js';
import DiscussionsService from '/imports/api/discussions/discussions-service.js';
import { Discussions } from '../discussions/discussions.js';
import { IdSchema, UserIdSchema, DiscussionIdSchema, optionsSchema, OrganizationIdSchema } from '../schemas.js';
import { checkDocExistance } from '../checkers.js';
import { getCollectionByDocType } from '../helpers.js';
import { CANNOT_CREATE_MESSAGE_FOR_DELETED, ONLY_OWNER_CAN_UPDATE } from '../errors.js';

const onInsertCheck = ({ discussionId }) => {
	const { linkedTo, documentType } = checkDocExistance(Discussions, { _id: discussionId });

	const { isDeleted, organizationId } = checkDocExistance(getCollectionByDocType(documentType), { _id: linkedTo });

	if (isDeleted) {
		throw CANNOT_CREATE_MESSAGE_FOR_DELETED;
	};

	return true;
};

const onUpdateCheck = ({ _id, userId }) => {
	const { createdBy } = checkDocExistance(Messages, { _id });

	if (userId !== createdBy) {
		throw ONLY_OWNER_CAN_UPDATE;
	}

	return true;
};

export const insert = new ValidatedMethod({
	name: 'Mesages.insert',
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

export const bulkUpdateViewedByTotal = new ValidatedMethod({
	name: 'Messages.bulkUpdateViewedByTotal',
	validate: OrganizationIdSchema.validator(),

	run({ organizationId }) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot update messages'
			);
		}

		return MessagesService.bulkUpdateViewedByTotal({ organizationId, userId });
	}
});

export const getMessages = new ValidatedMethod({
	name: 'Messages.getMessages',
	validate: new SimpleSchema([optionsSchema]).validator(),

	run({ query, options }) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot messages'
			);
		}
		query.createdBy = userId;

		return Messages.find(query, options);
	}
});

export const remove = new ValidatedMethod({
	name: 'Messages.remove',
	validate: new SimpleSchema([IdSchema]).validator(),

	run({ _id }) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot remove messages from discussions'
			);
		}

		onUpdateCheck({ _id, userId });

		return MessagesService.remove({ _id });
	}
});
