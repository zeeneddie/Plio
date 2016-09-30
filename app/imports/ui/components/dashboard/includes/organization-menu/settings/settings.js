import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { Departments } from '/imports/api/departments/departments.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import {
  StandardsBookSections
} from '/imports/api/standards-book-sections/standards-book-sections.js';

import { setNCGuideline, setRKGuideline } from '/imports/api/organizations/methods.js';


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
    const query = { organizationId: this.organizationId() };
    return Departments.find(query);
  },
  standardsTypes() {
    const query = { organizationId: this.organizationId() };
    return StandardTypes.find(query);
  },
  standardsBookSections() {
    const query = { organizationId: this.organizationId() };
    const options = { title: 1 };
    return StandardsBookSections.find(query, options);
  },
  riskTypes() {
    const query = { organizationId: this.organizationId() };
    return RiskTypes.find(query);
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
  NCGuidelines() {
    return this.organization().ncGuidelines;
  },
  RKGuidelines() {
    return this.organization().rkGuidelines;
  },
  rkScoringGuidelines() {
    return this.organization().rkScoringGuidelines;
  },
  setNCGuidelineMethod() {
    return setNCGuideline;
  },
  setRKGuidelineMethod() {
    return setRKGuideline;
  }
});
