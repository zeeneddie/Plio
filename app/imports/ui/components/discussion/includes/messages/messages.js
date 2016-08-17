import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';
import get from 'lodash.get';
import curry from 'lodash.curry';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { getFormattedDate } from '/imports/api/helpers.js';
import { bulkUpdateViewedBy } from '/imports/api/messages/methods.js';


Template.Discussion_Messages.viewmodel({
	mixin: ['discussions', 'messages', 'standard', 'user'],

	onRendered(tmp) {
		const discussionId = this.discussionId();

		if(discussionId){
			bulkUpdateViewedBy.call({ discussionId });
		}
	},

  // The _id of the primary discussion for this standardId
	discussion() {
		return Discussions.findOne({ _id: this.discussionId() });
	},
	getStartedByText() {
		const creator = Meteor.users.findOne({ _id: this.discussion().startedBy });
		return this.userNameOrEmail(creator && creator._id);
	},
	getStartedAtText() {
		return getFormattedDate(this.discussion().startedAt, 'MMMM Do, YYYY');
	},
	messages() {
		const messages = (() => {
			const options = {
  			sort: { createdAt: 1 }
  		};

			return this._getMessagesByDiscussionId(this.discussionId(), options).fetch();
		})();

		const messagesMapped = messages.map((message, i, arr) => {
			const { createdBy, createdAt } = message;

			const user = (() => {
				const query = { _id: createdBy };
				const options = {
					fields: {
						profile: 1,
						emails: 1,
						roles: 1
					}
				};

				return Meteor.users.findOne(query, options);
			})();

			const obj = (() => {
				const dateFormat = 'MMMM Do, YYYY';
				const timeFormat = 'h:mm A';
				const _id = message._id;
				const createdAt = message.createdAt;
				const date = createdAt ? getFormattedDate(createdAt, dateFormat) : null;
				const documentId = get(this.discussion(), 'linkedTo');

				return {
					_id,
					date,
					documentId,
					createdAt,
					user,
					dateToShow: (() => {
						const prevCreatedAt = get(messages[i - 1], 'createdAt');
						const prevMessageDate = prevCreatedAt ? getFormattedDate(prevCreatedAt, dateFormat) : null;

						return date !== prevMessageDate;
					})(),
					isMergedWithPreviousMessage: (() => {
						const prevMessage = messages[i - 1];
						const prevCreatedAt = get(prevMessage, 'createdAt');
						const prevCreatedBy = get(prevMessage, 'createdBy');

						if (message.createdBy === prevCreatedBy && message.createdAt - prevCreatedAt < 5 * 60 * 1000) {
							return true;
						}

						return false;
					})()
				};
			})();

			return Object.assign({}, message, obj);
		});

		return messagesMapped;
	}
});
