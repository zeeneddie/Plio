import { Organizations } from '/imports/api/organizations/organizations.js';
import { Departments } from '/imports/api/departments/departments.js';
import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';
import {
  StandardsBookSections
} from '/imports/api/standards-book-sections/standards-book-sections.js';


Template.Organizations_Settings.viewmodel({
  organization() {
    const serialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
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
    return StandardsTypes.find({
      organizationId: this.organizationId()
    });
  },
  standardsBookSections() {
    const organizationId = this.organization()._id;
    return StandardsBookSections.find({
      organizationId: this.organizationId()
    }, {
      sort: { number: 1, name: 1 }
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
  setSavingStateFn() {
    return this.setSavingState.bind(this);
  },
  setSavingState(val) {
    const modalHeading = this.child('ModalHeading');

    if (val !== undefined) {
      modalHeading.isSaving(val);
    }

    return modalHeading.isSaving();
  }
});
