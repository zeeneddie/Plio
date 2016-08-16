import { Meteor } from 'meteor/meteor';

const { Error:E } = Meteor;

export const NOT_AN_ORG_MEMBER = new E(403, 'You are not a member of this organization');

export const DOC_NOT_FOUND = new E(400, 'The document you are looking for is not found');
