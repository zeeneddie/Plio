import moment from 'moment-timezone';

import { AuditLogs } from '/imports/api/audit-logs/audit-logs.js';
import { CollectionNames } from '/imports/api/constants.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { Standards } from '/imports/api/standards/standards.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { Actions } from '/imports/api/actions/actions.js';


export default class RecapSender {

  constructor(orgOrId) {
    let org = orgOrId;
    if (_(orgOrId).isString()) {
      org = Organizations.findOne({ _id: orgOrId });
    }

    this._organization = org;
  }

  send() {
    /*const { timezone } = this._organization;
    const previousDay = moment().tz(timezone).subtract(1, 'day');
    const startDate = previousDay.startOf('day');
    const endDate = previousDay.endOf('day');*/
  }

}
