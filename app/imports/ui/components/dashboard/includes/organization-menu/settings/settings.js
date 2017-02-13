import { Template } from 'meteor/templating';

import { Departments } from '/imports/share/collections/departments.js';
import { StandardTypes } from '/imports/share/collections/standards-types.js';
import { RiskTypes } from '/imports/share/collections/risk-types.js';
import {
  StandardsBookSections,
} from '/imports/share/collections/standards-book-sections.js';
import { isOrgOwner } from '/imports/api/checkers';
import { setNCGuideline, setRKGuideline } from '/imports/api/organizations/methods.js';

import HomeTitlesSubcardContainer
  from '/imports/ui/react/organization-settings/containers/HomeTitlesSubcardContainer';
import ReviewContainer
  from '/imports/ui/react/organization-settings/containers/ReviewContainer';

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
  homeTitlesSubcard() {
    return HomeTitlesSubcardContainer;
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
    const organization = this.organization();
    return organization ? organization.ownerId() : '';
  },
  workflowDefaults() {
    const { workflowDefaults } = this.organization() || {};
    return workflowDefaults;
  },
  reminders() {
    const { reminders } = this.organization() || {};
    return reminders;
  },
  NCGuidelines() {
    const { ncGuidelines } = this.organization() || {};
    return ncGuidelines;
  },
  RKGuidelines() {
    const { rkGuidelines } = this.organization() || {};
    return rkGuidelines;
  },
  rkScoringGuidelines() {
    const { rkScoringGuidelines } = this.organization() || {};
    return rkScoringGuidelines;
  },
  setNCGuidelineMethod() {
    return setNCGuideline;
  },
  setRKGuidelineMethod() {
    return setRKGuideline;
  },
  showDangerZone() {
    return isOrgOwner(Meteor.userId(), this.organizationId());
  },
  reviewContainer() {
    return ReviewContainer;
  },
});
