import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';

import { getFormattedDate } from '/imports/api/helpers.js';

export const getStartedByText = ({ startedBy } = {}) =>
  invoke(Meteor.users.findOne({ _id: startedBy }), 'fullNameOrEmail');

export const getStartedAtText = ({ startedAt } = {}) =>
  getFormattedDate(startedAt, 'MMMM Do, YYYY');
