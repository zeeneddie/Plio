import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MessagesSchema } from './messages-schema';
import MessagesService from './messages-service.js';
import { IdSchema, UserIdSchema } from '../schemas.js';
//import { UserRoles } from '../constants';


export const addMessage = new ValidatedMethod({
	name: 'Mesages.addMessage',
	validate: MessagesSchema.validator(),

	run(doc) {
		if (!this.userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot add messages to discussions'
			);
		}

		return MessagesService.addMessage(doc);
	}
});

export const markMessageViewedById = new ValidatedMethod({
	name: 'Messages.markMessageViewedById',
	validate: new SimpleSchema([IdSchema]).validator(),

	run({ _id }) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot update the discussions'
			);
		}

		return MessagesService.markMessageViewedById({ _id, userId });
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

		return MessagesService.removeMessageById({ _id });
	}
});
