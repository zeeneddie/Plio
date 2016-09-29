import { Meteor } from 'meteor/meteor';

import BaseAuditManager from '/imports/share/utils/base-audit-manager.js';
import BackgroundApp from './background-app.js';


export default AuditManager = _.extend({}, BaseAuditManager, {

  documentCreated(newDocument, userId, collectionName) {
    BackgroundApp.call('documentCreated', {
      newDocument, userId, collectionName
    });
  },

  documentUpdated(newDocument, oldDocument, userId, collectionName) {
    BackgroundApp.call('documentUpdated', {
      newDocument, oldDocument, userId, collectionName
    });
  },

  documentRemoved(oldDocument, userId, collectionName) {
    BackgroundApp.call('documentRemoved', {
      oldDocument, userId, collectionName
    });
  }

});
