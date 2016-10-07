import { Discussions } from './discussions';
import { Messages } from '../messages/messages';
import { getUserViewedByData } from './helpers.js';
import { getJoinUserToOrganizationDate } from '../organizations/utils.js';
import { getNewerDate, lengthMessages, compareDates } from '../helpers.js';

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

	updateViewedByDiscussion({ _id, messageId, userId }) {
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

			return this.collection.update(newQuery, modifier);
		}

		const modifier = {
			$set: {
				'viewedBy.$': doc
			}
		};

		return this.collection.update(query, modifier);
	},

	updateViewedByOrganization({ _id:organizationId, userId }) {
		const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
			organizationId, userId
		});

		const discussions = this.collection.find({ organizationId }).fetch();

		const mapped = discussions.map((discussion) => {
			const { _id:discussionId } = discussion;
			const { viewedUpTo } = Object.assign({}, getUserViewedByData(userId, discussion));
			const query = {
				organizationId,
				discussionId,
				createdAt: {
					$gt: getNewerDate(currentOrgUserJoinedAt, viewedUpTo)
				}
			};
			const messages = Messages.find(query).fetch();

			return {
				messages,
				viewedUpTo,
				_id: discussionId
			};
		});

		const filtered = mapped.filter(lengthMessages);

		return filtered.map(({ _id, messages, viewedUpTo }) => {
			const lastMessage = Object.assign({}, _.last(messages));

			if (compareDates(viewedUpTo, lastMessage.createdAt) === -1) {
				return this.updateViewedByDiscussion({
					_id,
					userId,
					messageId: lastMessage._id
				});
			}
		});
	}
};
