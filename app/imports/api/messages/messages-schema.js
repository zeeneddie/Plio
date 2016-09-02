import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
	BaseEntitySchema, DiscussionIdSchema, FileIdsSchema,
	UserIdSchema, ViewedBySchema
} from '../schemas.js';


export const MessagesSchema = new SimpleSchema([
	BaseEntitySchema,
	DiscussionIdSchema,
	ViewedBySchema,
	FileIdsSchema,
	{
		message: {
			type: String,
			max: 140,
			optional: true
		},

		// 'text' or 'file'
		type: {
			type: String
		}
	}
]);
