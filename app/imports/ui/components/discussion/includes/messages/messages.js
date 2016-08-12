import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';
import get from 'lodash.get';
import curry from 'lodash.curry';

import { Messages } from '/imports/api/messages/messages.js';
import { getFormattedDate } from '/imports/api/helpers.js';


Template.Discussion_Messages.viewmodel({
	mixin: ['discussions', 'messages', 'standard', 'user'],

  /* The _id of the first discussion from the sorted list of discussions
   * for this standardId
  */
  discussionId() {
    return this.getDiscussionIdByStandardId(this.standardId());
  },

	messages() {
		const messages = (() => {
			const options = {
  			sort: { createdAt: 1 }
  		};

			return this._getMessagesByDiscussionId(this.discussionId(), options).fetch();
		})();

		const messagesMapped = messages.map((message, i, arr) => {
			const { userId, createdAt } = message;

			const user = (() => {
				const query = { _id: userId };
				const options = {
					fields: {
						profile: 1
					}
				};

				return Meteor.users.findOne(query, options);
			})();

			const obj = (() => {
				const getDate = curry(getFormattedDate)(createdAt);

				const dateFormat = 'MMMM Do, YYYY';
				const timeFormat = 'HH:mm';
				const date = getDate(dateFormat);

				return {
					date,
					time: getDate(timeFormat),
					avatar: invoke(user, 'avatar'),
					username: invoke(user, 'firstName'),
					dateToShow: (() => {
						const prevCreatedAt = get(messages[i - 1], 'createdAt');
						// we need to check for undefined because moment translates undefined to today's date
						const prevDate = prevCreatedAt ? getFormattedDate(prevCreatedAt, dateFormat) : null;
						return !Object.is(date, prevDate);
					})()
				};
			})();

			return Object.assign({}, message, obj);
		});

		return messagesMapped;
	}
});
