import { Discussions } from './discussions.js';


export default {
	collection: Discussions,

	insert({ ...args }) {
		return this.collection.insert({ ...args });
	},

	start(_id, startedBy) {
		this.collection.update({ _id }, { $set: {
			startedBy,
			startedAt: new Date,
			isStarted: true
		}});
	},

	remove({ _id }) {
		return this.collection.remove({ _id });
	}
}
