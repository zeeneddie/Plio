import { Organizations } from '/imports/share/collections/organizations.js';
import { Actions } from '/imports/share/collections/actions.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import { WorkItems } from '/imports/share/collections/work-items.js';
import { WorkflowTypes } from '/imports/share/constants.js';
import ActionWorkflow from '/imports/workflow/ActionWorkflow.js';
import NCWorkflow from '/imports/workflow/NCWorkflow.js';
import RiskWorkflow from '/imports/workflow/RiskWorkflow.js';
import WorkItemWorkflow from '/imports/workflow/WorkItemWorkflow.js';


export default class WorkflowUpdater {

  constructor(organizationId) {
    if (!SimpleSchema.RegEx.Id.test(organizationId)) {
      throw new Error(`${JSON.stringify(id)} is not valid organization ID`);
    }

    this._organizationId = organizationId;
  }

  _prepare() {
    const org = Organizations.findOne({ _id: this._organizationId });
    if (!org) {
      throw new Error(
        `Organization with ID ${this._organizationId} does not exist`
      );
    }

    this._organization = org;
  }

  update() {
    const actionsIds = Actions.find({
      organizationId: this._organizationId,
      $or: [{
        isCompleted: false,
        completedAt: { $exists: false },
        completedBy: { $exists: false }
      }, {
        isCompleted: true,
        completedAt: { $exists: true },
        completedBy: { $exists: true },
        isVerified: false,
        verifiedAt: { $exists: false },
        verifiedBy: { $exists: false },
        status: { $ne: 9 } // Completed
      }]
    }).map(doc => doc._id);

    _(actionsIds).each(id => new ActionWorkflow(id).refreshStatus());

    const problemDocQuery = {
      workflowType: WorkflowTypes.SIX_STEP,
      organizationId: this._organizationId,
      $or: [{
        'analysis.status': 0, // Not completed
        'analysis.completedAt': { $exists: false },
        'analysis.completedBy': { $exists: false }
      }, {
        'updateOfStandards.status': 0, // Not completed
        'updateOfStandards.completedAt': { $exists: false },
        'updateOfStandards.completedBy': { $exists: false }
      }]
    };

    const NCsIds = NonConformities.find(problemDocQuery).map(doc => doc._id);
    _(NCsIds).each(id => new NCWorkflow(id).refreshStatus());

    const risksIds = Risks.find(problemDocQuery).map(doc => doc._id);
    _(risksIds).each(id => new RiskWorkflow(id).refreshStatus());

    const workItemsIds = WorkItems.find({
      organizationId: this._organizationId,
      isCompleted: false
    }).map(doc => doc._id);
    _(workItemsIds).each(id => new WorkItemWorkflow(id).refreshStatus());
  }

}
