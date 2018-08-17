import { FlowRouter } from 'meteor/kadira:flow-router';
import { Match } from 'meteor/check';
import { Organizations } from '/imports/share/collections/organizations.js';
import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils.js';

export default {
  /**
   * The document is new if it was created after the user had joined the
   * organisation and was not viewed by the user:
   * @param {{ createdAt: Number, viewedBy: [String] }} doc;
   * @param {String} userId - user ID.
   */
  isNewDoc({ doc, userId }) {
    const dateUserJoinedToOrg = getJoinUserToOrganizationDate({
      organizationId: this.organizationId(), userId,
    });

    if (!dateUserJoinedToOrg) {
      return false;
    }

    const viewedBy = doc.viewedBy;

    const isDocViewedByUser = !!viewedBy
      && Match.test(viewedBy, Array)
      && _.contains(viewedBy, userId);

    return !isDocViewedByUser && doc.createdAt > dateUserJoinedToOrg;
  },

  isAdminOrg() {
    return this.organization() && this.organization().isAdminOrg;
  },

  organization() {
    const serialNumber = this.organizationSerialNumber();
    return Organizations.findOne({ serialNumber });
  },
  organizationId() {
    return this.organization() && this.organization()._id;
  },
  organizationSerialNumber() {
    const querySerialNumberParam = FlowRouter.getParam('orgSerialNumber');
    const serialNumber = parseInt(querySerialNumberParam, 10);

    return isNaN(serialNumber) ? querySerialNumberParam : serialNumber;
  },
};
