import { Template } from 'meteor/templating';

import { Organizations } from '/imports/share/collections/organizations.js';
import { Departments } from '/imports/share/collections/departments.js';
import { StandardTypes } from '/imports/share/collections/standards-types.js';
import { RiskTypes } from '/imports/share/collections/risk-types.js';
import {
  StandardsBookSections
} from '/imports/share/collections/standards-book-sections.js';

import { setNCGuideline, setRKGuideline } from '/imports/api/organizations/methods.js';


import { NonConformities } from '/imports/share/collections/non-conformities';


Template.OrgSettings.viewmodel({
  mixin: 'organization',
  name: '',
  currency: '',
  timezone: '',
  onCreated() {
    this.templateInstance.subscribe('nonConformityCard', 'fNcP9ifXiqK6MqYoC', 'KwKXz5RefrE5hjWJ2');
  },
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
  },
  nc() {
    return NonConformities.findOne({ _id: 'fNcP9ifXiqK6MqYoC' });
  }
});
