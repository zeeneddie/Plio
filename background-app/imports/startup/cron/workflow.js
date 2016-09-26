import { Actions } from '/imports/share/collections/actions.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import { WorkflowTypes } from '/imports/share/constants.js';

//import ActionWorkflow from '/imports/core/workflow/server/ActionWorkflow.js';
//import NCWorkflow from '/imports/core/workflow/server/NCWorkflow.js';
//import RiskWorkflow from '/imports/core/workflow/server/RiskWorkflow.js';


SyncedCron.add({
  name: 'Update workflow statuses',

  schedule(parser) {
    return parser.text('every 15 mins');
  },

  job() {
    /*const actions = Actions.find({
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
    });

    actions.forEach(doc => new ActionWorkflow(doc).refreshStatus());

    const problemDocQuery = {
      workflowType: WorkflowTypes.SIX_STEP,
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

    const NCs = NonConformities.find(problemDocQuery);
    NCs.forEach(doc => new NCWorkflow(doc).refreshStatus());

    const risks = Risks.find(problemDocQuery);
    risks.forEach(doc => new RiskWorkflow(doc).refreshStatus());*/
  }
});
