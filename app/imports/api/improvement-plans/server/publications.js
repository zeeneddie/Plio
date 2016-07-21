import { Meteor } from 'meteor/meteor';
import { ImprovementPlans } from '../improvement-plans.js';
import { Standards } from '../../standards/standards.js';
import { NonConformities } from '../../non-conformities/non-conformities.js';
import { Risks } from '../../risks/risks.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('NCImprovementPlan', function(NCId) {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }

  const NC = NonConformities.findOne({ _id: NCId });
  const organizationId = NC && NC.organizationId;

  if (!isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return ImprovementPlans.find({ documentId: NCId });
});

Meteor.publish('standardImprovementPlan', function(standardId) {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }

  const standard = Standards.findOne({ _id: standardId });
  const organizationId = standard && standard.organizationId;

  if (!isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return ImprovementPlans.find({ documentId: standardId });
});

Meteor.publish('riskImprovementPlan', function(riskId) {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }

  const risk = Risks.findOne({ _id: riskId });
  const organizationId = risk && risk.organizationId;

  if (!isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return ImprovementPlans.find({ documentId: riskId });
});
