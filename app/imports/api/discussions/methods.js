import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { DiscussionsSchema } from './discussions-schema';
import DiscussionsService from './discussions-service.js';
import { IdSchema, UserIdSchema } from '../schemas.js';
//import { UserRoles } from '../constants';


export const addDiscussion = new ValidatedMethod({
	name: 'Discussions.addMessage',
	validate: DiscussionsSchema.validator(),

	run(doc){
		if(!this.userId){
			throw new Meteor.Error(
				403, 'Unauthorized user cannot create new discussions'
			);
		}

		return DiscussionsService.addDiscussion(doc);
	}
});
