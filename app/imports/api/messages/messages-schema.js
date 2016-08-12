import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
	BaseEntitySchema, DiscussionIdSchema, FilesSchema,
	UserIdSchema, ViewedBySchema
} from '../schemas.js';


export const MessagesSchema = new SimpleSchema([
	BaseEntitySchema,
	DiscussionIdSchema,
	FilesSchema,
	UserIdSchema,
	ViewedBySchema,
	{
		message: {
			type: String,
			max: 140
		}
	}
]);
