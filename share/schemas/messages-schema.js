import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
	BaseEntitySchema, DiscussionIdSchema, FileIdSchema,
	UserIdSchema, ViewedBySchema, OrganizationIdSchema
} from './schemas.js';


export const MessagesSchema = new SimpleSchema([
	BaseEntitySchema,
	DiscussionIdSchema,
	ViewedBySchema,
	OrganizationIdSchema,
	{
		text: {
			type: String,
			max: 140,
			optional: true
		},
		fileId: {
			type: String,
		  regEx: SimpleSchema.RegEx.Id,
			optional: true
		},

		// 'text' or 'file'
		type: {
			type: String
		}
	}
]);
