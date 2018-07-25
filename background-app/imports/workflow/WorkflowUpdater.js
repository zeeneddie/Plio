import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { getId } from 'plio-util';

import {
  Organizations,
  Actions,
  NonConformities,
  Risks,
  WorkItems,
  Goals,
  Milestones,
} from '../share/collections';
import { WorkflowTypes } from '../share/constants';
import ActionWorkflow from './ActionWorkflow';
import NCWorkflow from './NCWorkflow';
import RiskWorkflow from './RiskWorkflow';
import WorkItemWorkflow from './WorkItemWorkflow';
import GoalWorkflow from './GoalWorkflow';
import MilestoneWorkflow from './MilestoneWorkflow';

export default class WorkflowUpdater {
  constructor(organizationId) {
    if (!SimpleSchema.RegEx.Id.test(organizationId)) {
      throw new Error(`${JSON.stringify(organizationId)} is not valid organization ID`);
    }

    this._organizationId = organizationId;
  }

  _prepare() {
    const org = Organizations.findOne({ _id: this._organizationId });
    if (!org) {
      throw new Error(`Organization with ID ${this._organizationId} does not exist`);
    }

    this._organization = org;
  }

  update() {
    const options = { fields: { _id: 1 } };
    const actionsIds = Actions.find({
      organizationId: this._organizationId,
      $or: [{
        isCompleted: false,
        completedAt: { $exists: false },
        completedBy: { $exists: false },
      }, {
        isCompleted: true,
        completedAt: { $exists: true },
        completedBy: { $exists: true },
        isVerified: false,
        verifiedAt: { $exists: false },
        verifiedBy: { $exists: false },
        status: { $ne: 9 }, // Completed
      }],
    }, options).map(getId);

    actionsIds.forEach(id => new ActionWorkflow(id).refreshStatus());

    const problemDocQuery = {
      workflowType: WorkflowTypes.SIX_STEP,
      organizationId: this._organizationId,
      $or: [{
        'analysis.status': 0, // Not completed
        'analysis.completedAt': { $exists: false },
        'analysis.completedBy': { $exists: false },
      }, {
        'updateOfStandards.status': 0, // Not completed
        'updateOfStandards.completedAt': { $exists: false },
        'updateOfStandards.completedBy': { $exists: false },
      }],
    };

    const NCsIds = NonConformities.find(problemDocQuery, options).map(getId);

    NCsIds.forEach(id => new NCWorkflow(id).refreshStatus());

    const risksIds = Risks.find(problemDocQuery, options).map(getId);

    risksIds.forEach(id => new RiskWorkflow(id).refreshStatus());

    const nonCompletedQuery = {
      organizationId: this._organizationId,
      isCompleted: false,
    };

    const workItemsIds = WorkItems.find(nonCompletedQuery, options).map(getId);

    workItemsIds.forEach(id => new WorkItemWorkflow(id).refreshStatus());

    // update only non-completed
    // cuz status can't be changed over time if overdue
    const goalIds = Goals.find(nonCompletedQuery, options).map(getId);

    goalIds.forEach(id => new GoalWorkflow(id).refreshStatus());

    const milestoneIds = Milestones.find(nonCompletedQuery, options).map(getId);

    milestoneIds.forEach(id => new MilestoneWorkflow(id).refreshStatus());
  }
}
