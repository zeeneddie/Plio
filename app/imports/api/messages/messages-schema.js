import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
	CreatedAtSchema, DiscussionIdSchema, FilesSchema,	UserIdSchema
} from '../schemas.js';


export const MessagesSchema = new SimpleSchema([
	CreatedAtSchema,
	DiscussionIdSchema,
	FilesSchema,
	UserIdSchema,
	{
		message: {
			type: String
		},
		viewedBy: {
			type: [String],
			regEx: SimpleSchema.RegEx.Id
		}
	}
]);
