import { Actions } from '/imports/api/actions/actions.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { WorkflowTypes } from '/imports/api/constants.js';

import ActionWorkflow from '/imports/api/actions/ActionWorkflow.js';
import NCWorkflow from '/imports/api/non-conformities/NCWorkflow.js';
import RiskWorkflow from '/imports/api/risks/RiskWorkflow.js';


SyncedCron.add({
  name: 'Update workflow statuses',

  schedule(parser) {
    return parser.text('every 1 hour');
  },

  job() {
    const actions = Actions.find({
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
      'analysis.status': 0, // Not completed
      'analysis.completedAt': { $exists: false },
      'analysis.completedBy': { $exists: false }
    };

    const NCs = NonConformities.find(problemDocQuery);
    NCs.forEach(doc => new NCWorkflow(doc).refreshStatus());

    const risks = Risks.find(problemDocQuery);
    risks.forEach(doc => new RiskWorkflow(doc).refreshStatus());
  }
});
