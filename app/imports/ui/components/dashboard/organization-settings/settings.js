import { Organizations } from '/imports/api/organizations/organizations.js';
import { Departments } from '/imports/api/departments/departments.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import {
  StandardsBookSections
} from '/imports/api/standards-book-sections/standards-book-sections.js';


Template.OrganizationSettings.viewmodel({
  name: '',
  currency: '',
  autorun() {
    const org = this.organization();
    if (org) {
      this.load(_.pick(org, ['name', 'currency']));
    }
  },
  organization() {
    const serialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
    return Organizations.findOne({ serialNumber });
  },
  organizationId() {
    return this.organization()._id;
  },
  departments() {
    return Departments.find({
      organizationId: this.organizationId()
    });
  },
  standardsTypes() {
    return StandardTypes.find({
      organizationId: this.organizationId()
    });
  },
  standardsBookSections() {
    const organizationId = this.organization()._id;
    return StandardsBookSections.find({
      organizationId: this.organizationId()
    }, {
      sort: { title: 1 }
    });
  },
  owner() {
    const orgOwner = Meteor.users.findOne({
      _id: this.organization().ownerId()
    });
    return orgOwner ? orgOwner.fullName() : '';
  },
  stepTimes() {
    return this.organization().ncStepTimes;
  },
  reminders() {
    return this.organization().ncReminders;
  },
  guidelines() {
    return this.organization().ncGuidelines;
  }
});
