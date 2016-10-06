import { Discussions } from './discussions';
import { Messages } from '../messages/messages';


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
	},

	updateViewedBy({ _id, messageId, userId }) {
		const query = {
			_id,
			viewedBy: {
				$elemMatch: { userId }
			}
		};

		const message = Object.assign({}, Messages.findOne({ _id: messageId }));

		const doc = {
			userId,
			messageId,
			viewedUpTo: message.createdAt
		};

		if (!this.collection.findOne(query)) {
			const newQuery = { _id };
			const modifier = {
				$addToSet: {
					viewedBy: doc
				}
			};

			if (Meteor.isServer) {
				return Meteor.defer(() => this.collection.update(newQuery, modifier));
			}

			return this.collection.update(newQuery, modifier)
		}

		const modifier = {
			$set: {
				'viewedBy.$': doc
			}
		};

		if (Meteor.isServer) {
			return Meteor.defer(() => this.collection.update(query, modifier));
		}

		return this.collection.update(query, modifier);
	}
};
