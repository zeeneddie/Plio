import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Organizations } from '/imports/share/collections/organizations';
import { Actions } from '/imports/share/collections/actions';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import { WorkItems } from '/imports/share/collections/work-items';
import { WorkflowTypes } from '/imports/share/constants';
import ActionWorkflow from '/imports/workflow/ActionWorkflow';
import NCWorkflow from '/imports/workflow/NCWorkflow';
import RiskWorkflow from '/imports/workflow/RiskWorkflow';
import WorkItemWorkflow from '/imports/workflow/WorkItemWorkflow';


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
    }, {
      fields: { _id: 1 },
    }).map(doc => doc._id);

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

    const NCsIds = NonConformities.find(problemDocQuery, {
      fields: { _id: 1 },
    }).map(doc => doc._id);

    NCsIds.forEach(id => new NCWorkflow(id).refreshStatus());

    const risksIds = Risks.find(problemDocQuery, {
      fields: { _id: 1 },
    }).map(doc => doc._id);

    risksIds.forEach(id => new RiskWorkflow(id).refreshStatus());

    const workItemsIds = WorkItems.find({
      organizationId: this._organizationId,
      isCompleted: false,
    }, {
      fields: { _id: 1 },
    }).map(doc => doc._id);

    workItemsIds.forEach(id => new WorkItemWorkflow(id).refreshStatus());
  }
}
