import Handlebars from 'handlebars';
import moment from 'moment-timezone';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { SystemName } from '/imports/api/constants.js';


export const getUserId = (user) => {
  return (user === SystemName) ? user : user._id;
};

export const getUserFullNameOrEmail = (userOrId) => {
  let user = userOrId;
  if (typeof userOrId === 'string') {
    if (userOrId === SystemName) {
      return userOrId;
    }

    user = Meteor.users.findOne({ _id: userOrId });
  }

  return (user && user.fullNameOrEmail()) || 'Ghost';
};

export const getPrettyOrgDate = (date, organizationId, format = 'MMMM DD, YYYY') => {
  const { timezone } = Organizations.findOne({ _id: organizationId }) || {};

  return moment(date).tz(timezone || 'UTC').format(format);
};

export const renderTemplate = (template, data = {}) => {
  const compiledTemplate = Handlebars.compile(template);

  return compiledTemplate(data);
};
