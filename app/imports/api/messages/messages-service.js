import { Messages } from './messages.js';

export default {
	collection: Messages,

	insert({ ...args }) {
		return this.collection.insert({ ...args });
	},

  update({ _id, query = {}, options = {}, ...args }) {
    if (!_.keys(query).length > 0) {
      query = { _id };
    }
    if (!_.keys(options).length > 0) {
      options['$set'] = args;
    }

    return this.collection.update(query, options);
  },

	updateViewedBy({ _id, userId }) {
		return this.collection.update({ _id }, {
			$addToSet: { viewedBy: userId }
		});
	},

	bulkUpdateViewedBy({ discussionId, userId }) {
		return this.collection.update({ discussionId }, {
			$addToSet: { viewedBy: userId }
		}, { multi: true });
	},

	remove({ _id }) {
		return this.collection.remove({ _id });
	},
}
