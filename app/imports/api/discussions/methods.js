// import { Meteor } from 'meteor/meteor';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//
// import { DiscussionsSchema } from './discussions-schema';
// import DiscussionsService from './discussions-service.js';
// import { IdSchema, UserIdSchema } from '../schemas.js';


// export const addDiscussion = new ValidatedMethod({
// 	name: 'Discussions.addDiscussion',
// 	validate: DiscussionsSchema.validator(),
//
// 	run(doc){
// 		if(!this.userId){
// 			throw new Meteor.Error(
// 				403, 'Unauthorized user cannot create new discussions'
// 			);
// 		}
//
// 		return DiscussionsService.addDiscussion(doc);
// 	}
// });

// export const removeDiscussionById = new ValidatedMethod({
// 	name: 'Discussions.removeDiscussionById',
// 	validate: IdSchema.validator(),
//
// 	run(doc){
// 		if(!this.userId){
// 			throw new Meteor.Error(
// 				403, 'Unauthorized user cannot remove discussions'
// 			);
// 		}
//
// 		return DiscussionsService.removeDiscussionById(doc);
// 	}
// });
