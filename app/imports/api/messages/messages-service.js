import { Messages } from './messages.js';

export default {
	collection: Messages,

	insert({ discussionId, message, userId }) {
		return this.collection.insert({
			discussionId, message, userId
		});
	},

	updateViewedBy({ _id, userId }) {
		return this.collection.update({ _id }, {
			$addToSet: { viewedBy: userId }
		});
	},

	bulkUpdateViewedBy({ discussionId, userId }) {
		return this.collection.update({ discussionId }, {
			$addToSet: { viewedBy: userId }
		}, { multi: true });
	},

	remove({ _id }) {
		return this.collection.remove({ _id });
	},
}
