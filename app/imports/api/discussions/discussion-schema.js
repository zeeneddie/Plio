import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { CreatedAtSchema, StandardIdSchema, UserIdSchema } from '../schemas.js';


export const DiscussionSchema = new SimpleSchema([
	CreatedAtSchema,
	StandardIdSchema,
	UserIdSchema,
	{
		message: {
			type: String
		}
	}
]);
