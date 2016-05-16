import { Organizations } from '/imports/api/organizations/organizations.js';
import { Departments } from '/imports/api/departments/departments.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import {
  StandardsBookSections
} from '/imports/api/standards-book-sections/standards-book-sections.js';


Template.OrganizationSettings.viewmodel({
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
  name() {
    return this.organization().name;
  },
  currency() {
    return this.organization().currency;
  },
  stepTimes() {
    return this.organization().ncStepTimes;
  },
  reminders() {
    return this.organization().ncReminders;
  },
  guidelines() {
    return this.organization().ncGuidelines;
  },
  guideHtml() {
    // TEMPORARY!!!
    return `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Praesent vestibulum accumsan nulla, non pulvinar neque.
      Quisque faucibus tempor imperdiet. Suspendisse feugiat, nibh nec
      maximus pellentesque, massa nunc mattis ipsum, in dictum magna
      arcu et ipsum.</p>`;
  }
});
