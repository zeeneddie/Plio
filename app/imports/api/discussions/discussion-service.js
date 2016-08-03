import { Discussions } from './discussion.js';


export default DiscussionService = {
	collection: Discussions,

	addMessage({
		createdAt, isRead, message, standardId, userId
	}){
		return this.collection.insert({
			createdAt, isRead, message, standardId, userId
		});
	},

	removeMessageById({_id}){
		return this.collection.remove({_id});
	},
}
