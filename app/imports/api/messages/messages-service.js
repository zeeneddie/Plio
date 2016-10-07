import { Messages } from './messages.js';

export default {
	collection: Messages,

	getMessagesByFileId({ fileId, options }){
		return this.collection.find({'files._id': fileId }, options);
	},

	insert({ ...args }) {
		return this.collection.insert({ ...args });
	},

  update({ _id, query = {}, options = {}, ...args }) {
    if (!_.keys(query).length > 0) {
      query = { _id };
    }
    if (!_.keys(options).length > 0) {
      options['$set'] = args;
    }

    return this.collection.update(query, options);
  },

	updateViewedBy({ _id, userId }) {
		return this.collection.update({ _id }, {
			$addToSet: { viewedBy: userId }
		});
	},

	bulkUpdateViewedBy({ discussionId, userId }) {
		const user = Meteor.users.findOne({ _id: userId });

		return Meteor.isServer && Meteor.defer(() => {
			return this.collection.update({
				discussionId,
				createdAt: { $gte: user.createdAt },
				viewedBy: { $ne: userId }
			}, {
				$addToSet: { viewedBy: userId }
			}, { multi: true });
		});
	},

	bulkUpdateViewedByTotal({ organizationId, userId }) {
		const user = Meteor.users.findOne({ _id: userId });

		return this.collection.update({
			organizationId,
			createdAt: { $gte: user.createdAt },
			viewedBy: { $ne: userId }
		}, {
			$addToSet: { viewedBy: userId }
		}, { multi: true });
	},

	remove({ _id }) {
		return this.collection.remove({ _id });
	}
}
