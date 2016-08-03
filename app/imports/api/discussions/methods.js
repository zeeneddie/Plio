import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { DiscussionSchema } from './discussion-schema';
import DiscussionService from './discussion-service.js';
import { IdSchema } from '../schemas.js';
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

export const removeMessageById = new ValidatedMethod({
	name: 'Discussions.removeMessageById',
	validate: new SimpleSchema([IdSchema]).validator(),

	run(doc){
		console.dir(doc);
		if(!this.userId){
			throw new Meteor.Error(
				403, 'Unauthorized user cannot remove messages from discussions'
			);
		}
		if(this.userId !== doc.userId){
			throw new Meteor.Error(
				403, 'Messages can be removed only by their authors'
			);
		}
		
		//return DiscussionService.removeMessageById(doc);
	}
});
