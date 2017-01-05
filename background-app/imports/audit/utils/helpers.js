import { Meteor } from 'meteor/meteor';
import moment from 'moment-timezone';

import { Organizations } from '/imports/share/collections/organizations.js';
import { DocumentTypes, SystemName } from '/imports/share/constants.js';
import StandardAuditConfig from '../configs/standards/standard-audit-config.js';
import NCAuditConfig from '../configs/non-conformities/nc-audit-config.js';
import RiskAuditConfig from '../configs/risks/risk-audit-config.js';


export const getUserId = user => ((user === SystemName) ? user : user._id);

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

export const getLinkedDocAuditConfig = (docType) => ({
  [DocumentTypes.STANDARD]: StandardAuditConfig,
  [DocumentTypes.NON_CONFORMITY]: NCAuditConfig,
  [DocumentTypes.RISK]: RiskAuditConfig,
}[docType]);
