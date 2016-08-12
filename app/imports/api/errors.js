import { Meteor } from 'meteor/meteor';

import DiscussionErrors from './discussions/errors.js';

const { Error:E } = Meteor;

export default {
  ...DiscussionErrors,
  NOT_AN_ORG_MEMBER: new E(403, 'You are not a member of this organization'),
  DOC_NOT_FOUND: new E(400, 'The document you are looking for is not found')
};
