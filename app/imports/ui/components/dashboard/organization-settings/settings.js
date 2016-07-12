import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { Departments } from '/imports/api/departments/departments.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import {
  StandardsBookSections
} from '/imports/api/standards-book-sections/standards-book-sections.js';


Template.OrgSettings.viewmodel({
  mixin: 'organization',
  name: '',
  currency: '',
  timezone: '',
  autorun() {
    const org = this.organization();
    if (org) {
      this.load(_.pick(org, ['name', 'currency', 'timezone']));
    }
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
  ownerId() {
    return this.organization().ownerId();
  },
  workflowDefaults() {
    return this.organization().workflowDefaults;
  },
  reminders() {
    return this.organization().reminders;
  },
  guidelines() {
    return this.organization().ncGuidelines;
  }
});
