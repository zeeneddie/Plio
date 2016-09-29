import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { CollectionNames } from '/imports/share/constants.js';
import { DocChangesKinds } from '/imports/audit/utils/changes-kinds.js';
import AuditConfigs from '/imports/audit/audit-configs.js';
import DocChangeHandler from '/imports/audit/DocChangeHandler.js';


const docDef = {
  type: Object,
  blackbox: true
};

const userIdDef = {
  type: String,
  regEx: SimpleSchema.RegEx.Id
};

const collectionNameDef = {
  type: String,
  allowedValues: _(CollectionNames).values()
};

const documentCreated = new ValidatedMethod({
  name: 'documentCreated',

  validate: new SimpleSchema({
    newDocument: docDef,
    userId: userIdDef,
    collectionName: collectionNameDef
  }).validator(),

  run({ newDocument, userId, collectionName }) {
    this.unblock();

    const config = AuditConfigs.get(collectionName);

    new DocChangeHandler(config, DocChangesKinds.DOC_CREATED, {
      newDocument, userId
    }).handleChange();
  }

});

const documentUpdated = new ValidatedMethod({
  name: 'documentUpdated',

  validate: new SimpleSchema({
    newDocument: docDef,
    oldDocument: docDef,
    userId: userIdDef,
    collectionName: collectionNameDef
  }).validator(),

  run({ newDocument, oldDocument, userId, collectionName }) {
    this.unblock();

    const config = AuditConfigs.get(collectionName);

    new DocChangeHandler(config, DocChangesKinds.DOC_UPDATED, {
      newDocument, oldDocument, userId
    }).handleChange();
  }

});

const documentRemoved = new ValidatedMethod({
  name: 'documentRemoved',

  validate: new SimpleSchema({
    oldDocument: docDef,
    userId: userIdDef,
    collectionName: collectionNameDef
  }).validator(),

  run({ oldDocument, userId, collectionName }) {
    this.unblock();

    const config = AuditConfigs.get(collectionName);

    new DocChangeHandler(config, DocChangesKinds.DOC_REMOVED, {
      oldDocument, userId
    }).handleChange();
  }

});
