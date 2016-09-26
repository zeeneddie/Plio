import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';

import { getFormattedDate } from '/imports/api/helpers.js';
export const getStartedByText = ({ discussion: { startedBy } = {} }) =>
  invoke(Meteor.users.findOne({ _id: startedBy }), 'fullNameOrEmail');

export const getStartedAtText = ({ discussion: { startedAt } = {} }) =>
  getFormattedDate(startedAt, 'MMMM Do, YYYY');
