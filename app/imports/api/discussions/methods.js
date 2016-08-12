import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { DiscussionsSchema } from './discussions-schema';
import DiscussionsService from './discussions-service.js';
import { IdSchema } from '../schemas.js';
import { getCollectionByDocType } from '../helpers.js';
import { checkOrgMembership, checkDocExistance } from '../checkers.js';
import { CANNOT_CREATE_DISCUSSION_FOR_DELETED_DOCUMENT } from '../errors.js';
import { Discussions } from './discussions.js';
//import { UserRoles } from '../constants';

export const addDiscussion = new ValidatedMethod({
	name: 'Discussions.addDiscussion',
	validate: DiscussionsSchema.validator(),

	run({ documentType, linkedTo }) {
		const userId = this.userId;
		const collection = getCollectionByDocType(documentType);

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot create new discussions'
			);
		}

		const { isDeleted } = checkOrgMembership(linkedTo, userId, collection);

		if (isDeleted) {
			throw CANNOT_CREATE_DISCUSSION_FOR_DELETED_DOCUMENT;
		}

		return DiscussionsService.addDiscussion({ documentType, linkedTo });
	}
});

export const removeDiscussionById = new ValidatedMethod({
	name: 'Discussions.removeDiscussionById',
	validate: IdSchema.validator(),

	run({ _id }) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot remove discussions'
			);
		}

		const { linkedTo, documentType } = checkDocExistance(_id, Discussions);
		const collection = getCollectionByDocType(documentType);

		checkOrgMembership(linkedTo, userId, collection);

		return DiscussionsService.removeDiscussionById({ _id });
	}
});
