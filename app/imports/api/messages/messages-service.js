import { Messages } from './messages.js';


export default MessagesService = {
	collection: Messages,

	addMessage({
		createdAt, discussionId, message, userId, viewedBy
	}){
		return this.collection.insert({
			createdAt, discussionId, message, userId, viewedBy
		});
	},

	markMessageViewedById({_id, userId}){
		return this.collection.update({_id}, {
			$addToSet: {viewedBy: userId}
		});
	},

	removeMessageById({_id}){
		return this.collection.remove({_id});
	},
}
