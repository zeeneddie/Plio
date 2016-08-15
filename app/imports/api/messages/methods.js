import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MessagesSchema } from './messages-schema';
import MessagesService from './messages-service.js';
import DiscussionsService from '/imports/api/discussions/discussions-service.js';
import { Discussions } from '../discussions/discussions.js';
import { IdSchema, UserIdSchema, DiscussionIdSchema, optionsSchema } from '../schemas.js';


export const addMessage = new ValidatedMethod({
	name: 'Mesages.addMessage',
	validate: MessagesSchema.validator(),

	run({ ...args }) {
		const userId = this.userId;
		const discussion = Discussions.findOne({ _id: args.discussionId });

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot add messages to discussions'
			);
		}

		if (!discussion) {
			throw new Meteor.Error(
				404, 'Discussion not found'
			);
		}

		return MessagesService.insert({ ...args });
	}
});

export const update = new ValidatedMethod({
  name: 'Messages.update',

  validate: new SimpleSchema([
    IdSchema, optionsSchema //, MessageUpdateSchema
  ]).validator(),

  run({ _id, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a message'
      );
    }
		// [TODO] only message owner can make an update

    return MessagesService.update({ _id, ...args });
  }
});

export const updateFilesUrls = new ValidatedMethod({
  name: 'Messages.updateFilesUrls',

  validate: new SimpleSchema([
    IdSchema, optionsSchema //, MessageUpdateSchema
  ]).validator(),

  run({ _id, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a message'
      );
    }
		// [TODO] only message owner can make an update

		const query = {
      files: {
        $elemMatch: { _id }
      }
    };
		const { options } = args;

    return MessagesService.update({ query, options });
  }
});

export const updateViewedBy = new ValidatedMethod({
	name: 'Messages.updateViewedBy',
	validate: IdSchema.validator(),

	run({ _id }) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot update the discussions'
			);
		}

		return MessagesService.updateViewedBy({ _id, userId });
	}
});

export const bulkUpdateViewedBy = new ValidatedMethod({
	name: 'Messages.bulkUpdateViewedBy',
	validate: DiscussionIdSchema.validator(),

	run({ discussionId }) {
		const userId = this.userId;

		if (!userId) {
			throw new Meteor.Error(
				403, 'Unauthorized user cannot update the discussions'
			);
		}

		return MessagesService.bulkUpdateViewedBy({ discussionId, userId });
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

		return MessagesService.remove({ _id });
	}
});
