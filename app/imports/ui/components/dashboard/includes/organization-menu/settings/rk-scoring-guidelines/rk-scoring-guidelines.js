import { Template } from 'meteor/templating';

import { setRKScoringGuidelines } from '/imports/api/organizations/methods.js';

Template.OrgSettings_RKScoringGuidelines.viewmodel({
  mixin: 'modal',
  label: 'Risk scoring guidelines',
  guidelines: '',
  organizationId: '',
  update({ notes:rkScoringGuidelines }) {
    const _id = this.organizationId();
    this.modal().callMethod(setRKScoringGuidelines, { _id, rkScoringGuidelines });
  }
});
