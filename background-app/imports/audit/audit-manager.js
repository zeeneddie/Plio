import { Meteor } from 'meteor/meteor';

import { DocChangesKinds } from './utils/changes-kinds.js';
import AuditConfigs from './audit-configs.js';
import DocChangeHandler from './DocChangeHandler.js';
import BaseAuditManager from '/imports/share/utils/base-audit-manager.js';


export default AuditManager = _.extend({}, BaseAuditManager, {

  documentCreated(newDocument, userId, collectionName) {
    const config = AuditConfigs.get(collectionName);

    new DocChangeHandler(config, DocChangesKinds.DOC_CREATED, {
      newDocument, userId
    }).handleChange();
  },

  documentUpdated(newDocument, oldDocument, userId, collectionName) {
    const config = AuditConfigs.get(collectionName);

    new DocChangeHandler(config, DocChangesKinds.DOC_UPDATED, {
      newDocument, oldDocument, userId
    }).handleChange();
  },

  documentRemoved(oldDocument, userId, collectionName) {
    const config = AuditConfigs.get(collectionName);

    new DocChangeHandler(config, DocChangesKinds.DOC_REMOVED, {
      oldDocument, userId
    }).handleChange();
  }

});
