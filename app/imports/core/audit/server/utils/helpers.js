import Handlebars from 'handlebars';
import moment from 'moment-timezone';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { DocumentTypes, SystemName } from '/imports/api/constants.js';
import StandardAuditConfig from '../configs/standard-audit-config.js';
import NCAuditConfig from '../configs/nc-audit-config.js';
import RiskAuditConfig from '../configs/risk-audit-config.js';


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

export const getLinkedDocAuditConfig = (docType) => {
  return {
    [DocumentTypes.STANDARD]: StandardAuditConfig,
    [DocumentTypes.NON_CONFORMITY]: NCAuditConfig,
    [DocumentTypes.RISK]: RiskAuditConfig
  }[docType];
};

export const renderTemplate = (template, data = {}) => {
  const compiledTemplate = Handlebars.compile(template);

  return compiledTemplate(data);
};
