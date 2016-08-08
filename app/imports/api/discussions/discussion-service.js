import { Discussions } from './discussion.js';


export default DiscussionService = {
	collection: Discussions,

	addMessage({
		createdAt, message, standardId, userId, viewedBy
	}){
		return this.collection.insert({
			createdAt, message, standardId, userId, viewedBy
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
