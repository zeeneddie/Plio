import { CollectionNames } from '/imports/share/constants.js';
import { Actions } from '/imports/share/collections/actions.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import { Standards } from '/imports/share/collections/standards.js';
import { Occurrences } from '/imports/share/collections/occurrences.js';
import { LessonsLearned } from '/imports/share/collections/lessons.js';
import { Messages } from '/imports/share/collections/messages.js';
import { Organizations } from '/imports/share/collections/organizations.js';
import { WorkItems } from '/imports/share/collections/work-items.js';
import AuditManager from '/imports/share/utils/audit-manager.js';


const collections = {
  [CollectionNames.ACTIONS]: Actions,
  [CollectionNames.NCS]: NonConformities,
  [CollectionNames.RISKS]: Risks,
  [CollectionNames.STANDARDS]: Standards,
  [CollectionNames.OCCURRENCES]: Occurrences,
  [CollectionNames.LESSONS]: LessonsLearned,
  [CollectionNames.MESSAGES]: Messages,
  [CollectionNames.ORGANIZATIONS]: Organizations,
  [CollectionNames.WORK_ITEMS]: WorkItems
};

_(collections).each((coll, name) => AuditManager.registerCollection(coll, name));

AuditManager.startAudit();
