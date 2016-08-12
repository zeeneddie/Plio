import { Messages } from './messages.js';

export default {
	collection: Messages,

	addMessage({ discussionId, message, userId }) {
		return this.collection.insert({
			discussionId, message, userId
		});
	},

	markMessageViewedById({ _id, userId }) {
		return this.collection.update({ _id }, {
			$addToSet: { viewedBy: userId }
		});
	},

	removeMessageById({ _id }) {
		return this.collection.remove({ _id });
	},
}
