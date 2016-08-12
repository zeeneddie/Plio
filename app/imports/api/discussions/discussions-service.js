import { Discussions } from './discussions.js';


export default DiscussionsService = {
	collection: Discussions,

	addDiscussion({documentType, linkedTo}){
		return this.collection.insert({documentType, linkedTo});
	},

	removeDiscussionById({_id}){
		return this.collection.remove({_id});
	}
}
