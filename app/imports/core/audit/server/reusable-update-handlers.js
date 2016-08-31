import { ChangesKinds } from './document-differ.js';
import Utils from '../../utils.js';


export const isDeletedField = {
  field: 'isDeleted',
  shouldCreateLog({ diffs: { deletedAt, deletedBy } }) {
    return deletedAt && deletedBy;
  },
  shouldSendNotification({ diffs: { deletedAt, deletedBy } }) {
    return deletedAt && deletedBy;
  },
  logTemplate: {
    [ChangesKinds.FIELD_CHANGED]:
      '{{#if deleted}}Document was deleted{{else}}Document was restored{{/if}}'
  },
  notificationTemplate: {
    [ChangesKinds.FIELD_CHANGED]:
      '{{userName}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}}'
  },
  logData({ diffs: { isDeleted } }) {
    return { deleted: isDeleted.newValue };
  },
  notificationData({ diffs: { isDeleted }, newDoc }) {
    return {
      docDesc: this.docDescription(newDoc),
      userName: Utils.getUserFullNameOrEmail(isDeleted.executor),
      deleted: isDeleted.newValue
    };
  },
  notificationReceivers() { }
};

export const filesField = {
  field: 'files',
  shouldCreateLog({ diffs: { files } }) {
    const { kind, item: { url } } = files;
    return !((kind === ChangesKinds.ITEM_ADDED) && !url);
  },
  shouldSendNotification({ diffs: { files } }) {
    const { kind, item: { url } } = files;
    return !((kind === ChangesKinds.ITEM_ADDED) && !url);
  },
  logTemplate: {
    [ChangesKinds.ITEM_ADDED]: 'File "{{fileName}}" uploaded',
    [ChangesKinds.ITEM_REMOVED]: 'File "{{fileName}}" removed'
  },
  notificationTemplate: {
    [ChangesKinds.ITEM_ADDED]:
      '{{userName}} uploaded file "{{fileName}}" for {{{docDesc}}}',
    [ChangesKinds.ITEM_REMOVED]:
      '{{userName}} removed file "{{fileName}}" from {{{docDesc}}}'
  },
  logData({ diffs: { files } }) {
    return { fileName: files.item.name };
  },
  notificationData({ diffs: { files }, newDoc }) {
    return {
      docDesc: this.docDescription(newDoc),
      userName: Utils.getUserFullNameOrEmail(files.executor),
      fileName: files.item.name
    };
  },
  notificationReceivers() { }
};

export const fileUrlField = {
  field: 'files.$.url',
  shouldCreateLog({ diffs }) {
    return !!diffs['files.$.url'].newValue;
  },
  shouldSendNotification({ diffs }) {
    return !!diffs['files.$.url'].newValue;
  },
  logTemplate: {
    [ChangesKinds.FIELD_ADDED]: 'File "{{fileName}}" uploaded',
    [ChangesKinds.FIELD_CHANGED]: 'File "{{fileName}}" uploaded',
  },
  notificationTemplate: {
    [ChangesKinds.FIELD_ADDED]:
      '{{userName}} uploaded file "{{fileName}}" for {{{docDesc}}}',
    [ChangesKinds.FIELD_CHANGED]:
      '{{userName}} uploaded file "{{fileName}}" for {{{docDesc}}}',
  },
  logData({ diffs, newDoc }) {
    const url = diffs['files.$.url'].newValue;
    const fileDoc = _(newDoc.files).find(file => file.url === url);

    return { fileName: fileDoc.name };
  },
  notificationData({ diffs, newDoc }) {
    const diff = diffs['files.$.url'];
    const url = diff.newValue;
    const fileDoc = _(newDoc.files).find(file => file.url === url);

    return {
      docDesc: this.docDescription(newDoc),
      userName: Utils.getUserFullNameOrEmail(diff.executor),
      fileName: fileDoc.name
    };
  },
  notificationReceivers() { }
};

export const notesField = {
  field: 'notes',
  logTemplate: {
    [ChangesKinds.FIELD_ADDED]: 'Notes set',
    [ChangesKinds.FIELD_CHANGED]: 'Notes changed',
    [ChangesKinds.FIELD_REMOVED]: 'Notes removed'
  },
  notificationTemplate: {
    [ChangesKinds.FIELD_ADDED]: '{{userName}} set notes of {{{docDesc}}}',
    [ChangesKinds.FIELD_CHANGED]: '{{userName}} changed notes of {{{docDesc}}}',
    [ChangesKinds.FIELD_REMOVED]: '{{userName}} removed notes of {{{docDesc}}}'
  },
  logData() { },
  notificationData({ diffs: { notes }, newDoc }) {
    return {
      docDesc: this.docDescription(newDoc),
      userName: Utils.getUserFullNameOrEmail(notes.executor),
    };
  },
  notificationReceivers() { }
};

export const notifyField = {
  field: 'notify',
  logTemplate: {
    [ChangesKinds.ITEM_ADDED]: '{{item}} was added to notification list',
    [ChangesKinds.ITEM_REMOVED]: '{{item}} was removed from notification list'
  },
  notificationTemplate: {
    [ChangesKinds.ITEM_ADDED]:
      '{{userName}} added {{item}} to notification list of {{{docDesc}}}',
    [ChangesKinds.ITEM_REMOVED]:
      '{{userName}} removed {{item}} from notification list of {{{docDesc}}}'
  },
  logData({ diffs: { notify } }) {
    return { item: Utils.getUserFullNameOrEmail(notify.item) };
  },
  notificationData({ diffs: { notify }, newDoc }) {
    return {
      docDesc: this.docDescription(newDoc),
      userName: Utils.getUserFullNameOrEmail(notify.executor),
      item: Utils.getUserFullNameOrEmail(notify.item)
    };
  },
  notificationReceivers() { }
};

export const ownerIdField = {
  field: 'ownerId',
  logTemplate: {
    [ChangesKinds.FIELD_ADDED]: 'Owner set to {{newValue}}',
    [ChangesKinds.FIELD_CHANGED]: 'Owner changed from {{oldValue}} to {{newValue}}',
    [ChangesKinds.FIELD_REMOVED]: 'Owner removed'
  },
  notificationTemplate: {
    [ChangesKinds.FIELD_ADDED]:
      '{{userName}} set owner of {{{docDesc}}} to {{newValue}}',
    [ChangesKinds.FIELD_CHANGED]:
      '{{userName}} changed owner of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
    [ChangesKinds.FIELD_REMOVED]:
      '{{userName}} removed owner of {{{docDesc}}}'
  },
  logData({ diffs: { ownerId } }) {
    return {
      newValue: Utils.getUserFullNameOrEmail(ownerId.newValue),
      oldValue: Utils.getUserFullNameOrEmail(ownerId.oldValue)
    };
  },
  notificationData({ diffs: { ownerId }, newDoc }) {
    return {
      docDesc: this.docDescription(newDoc),
      userName: Utils.getUserFullNameOrEmail(ownerId.executor),
      newValue: Utils.getUserFullNameOrEmail(ownerId.newValue),
      oldValue: Utils.getUserFullNameOrEmail(ownerId.oldValue)
    };
  },
  notificationReceivers() { }
};

export const titleField = {
  field: 'title',
  logTemplate: {
    [ChangesKinds.FIELD_ADDED]: 'Title set to "{{newValue}}"',
    [ChangesKinds.FIELD_CHANGED]: 'Title changed from "{{oldValue}}" to "{{newValue}}"',
    [ChangesKinds.FIELD_REMOVED]: 'Title removed'
  },
  notificationTemplate: {
    [ChangesKinds.FIELD_ADDED]:
      '{{userName}} set title of {{{docDesc}}} to "{{newValue}}"',
    [ChangesKinds.FIELD_CHANGED]:
      '{{userName}} changed title of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
    [ChangesKinds.FIELD_REMOVED]:
      '{{userName}} removed title of {{{docDesc}}}'
  },
  logData({ diffs: { title } }) {
    return {
      newValue: title.newValue,
      oldValue: title.oldValue
    };
  },
  notificationData({ diffs: { title }, oldDoc }) {
    return {
      docDesc: this.docDescription(oldDoc),
      userName: Utils.getUserFullNameOrEmail(title.executor),
      newValue: title.newValue,
      oldValue: title.oldValue
    };
  },
  notificationReceivers() { }
};
