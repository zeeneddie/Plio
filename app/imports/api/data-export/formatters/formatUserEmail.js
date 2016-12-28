import { _ } from 'meteor/underscore';

function formatUserEmail(emails) {
  return emails && _.first(emails).address;
}

export { formatUserEmail };
