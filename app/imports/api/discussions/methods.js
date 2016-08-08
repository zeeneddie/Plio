import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { DiscussionSchema } from './discussion-schema';
import DiscussionService from './discussion-service.js';
import { IdSchema, UserIdSchema } from '../schemas.js';
//import { UserRoles } from '../constants';


export const addMessage = new ValidatedMethod({
	name: 'Discussions.addMessage',
	validate: DiscussionSchema.validator(),

	run(doc){
		if(!this.userId){
			throw new Meteor.Error(
				403, 'Unauthorized user cannot add messages to discussions'
			);
		}
		
		return DiscussionService.addMessage(doc);
	}
});

export const markMessageViewedById = new ValidatedMethod({
	name: 'Discussions.markMessageViewedById',
	validate: new SimpleSchema([IdSchema, UserIdSchema]).validator(),

	run(doc){
		return DiscussionService.markMessageViewedById(doc);
	}
});

export const removeMessageById = new ValidatedMethod({
	name: 'Discussions.removeMessageById',
	validate: new SimpleSchema([IdSchema]).validator(),

	run(doc){
		if(!this.userId){
			throw new Meteor.Error(
				403, 'Unauthorized user cannot remove messages from discussions'
			);
		}
		
		return DiscussionService.removeMessageById(doc);
	}
});
