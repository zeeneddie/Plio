import { ChangesKinds } from '../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '/imports/api/helpers.js';


export const isDeletedField = {
  logConfig: {
    shouldCreateLog({ diffs: { deletedAt, deletedBy } }) {
      return deletedAt && deletedBy;
    },
    logTemplate: {
      [ChangesKinds.FIELD_CHANGED]:
        '{{#if deleted}}Document was deleted{{else}}Document was restored{{/if}}'
    },
    logData({ diffs: { isDeleted } }) {
      return { deleted: isDeleted.newValue };
    }
  },
  notificationConfig: {
    shouldSendNotification({ diffs: { deletedAt, deletedBy } }) {
      return deletedAt && deletedBy;
    },
    template: {
      [ChangesKinds.FIELD_CHANGED]:
        '{{userName}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}}'
    },
    templateData({ diffs: { isDeleted }, newDoc, user }) {
      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
        deleted: isDeleted.newValue
      };
    },
    receivers() { }
  }
};

export const filesField = {
  logConfig: {
    shouldCreateLog({ diffs: { files } }) {
      const { kind, item: { url } } = files;
      return !((kind === ChangesKinds.ITEM_ADDED) && !url);
    },
    template: {
      [ChangesKinds.ITEM_ADDED]: 'File "{{fileName}}" uploaded',
      [ChangesKinds.ITEM_REMOVED]: 'File "{{fileName}}" removed'
    },
    templateData({ diffs: { files } }) {
      return { fileName: files.item.name };
    }
  },
  notificationConfig: {
    shouldSendNotification({ diffs: { files } }) {
      const { kind, item: { url } } = files;
      return !((kind === ChangesKinds.ITEM_ADDED) && !url);
    },
    template: {
      [ChangesKinds.ITEM_ADDED]:
        '{{userName}} uploaded file "{{fileName}}" for {{{docDesc}}}',
      [ChangesKinds.ITEM_REMOVED]:
        '{{userName}} removed file "{{fileName}}" from {{{docDesc}}}'
    },
    templateData({ diffs: { files }, newDoc, user }) {
      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
        fileName: files.item.name
      };
    },
    receivers() { }
  }
};

export const fileUrlField = {
  logConfig: {
    shouldCreateLog({ diffs }) {
      return !!diffs['files.$.url'].newValue;
    },
    template: {
      [ChangesKinds.FIELD_ADDED]: 'File "{{fileName}}" uploaded',
      [ChangesKinds.FIELD_CHANGED]: 'File "{{fileName}}" uploaded',
    },
    templateData({ diffs, newDoc }) {
      const url = diffs['files.$.url'].newValue;
      const fileDoc = _(newDoc.files).find(file => file.url === url);

      return { fileName: fileDoc.name };
    }
  },
  notificationConfig: {
    shouldSendNotification({ diffs }) {
      return !!diffs['files.$.url'].newValue;
    },
    template: {
      [ChangesKinds.FIELD_ADDED]:
        '{{userName}} uploaded file "{{fileName}}" for {{{docDesc}}}',
      [ChangesKinds.FIELD_CHANGED]:
        '{{userName}} uploaded file "{{fileName}}" for {{{docDesc}}}',
    },
    templateData({ diffs, newDoc, user }) {
      const diff = diffs['files.$.url'];
      const url = diff.newValue;
      const fileDoc = _(newDoc.files).find(file => file.url === url);

      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
        fileName: fileDoc.name
      };
    },
    receivers() { }
  }
};

export const notesField = {
  logConfig: {
    template: {
      [ChangesKinds.FIELD_ADDED]: 'Notes set',
      [ChangesKinds.FIELD_CHANGED]: 'Notes changed',
      [ChangesKinds.FIELD_REMOVED]: 'Notes removed'
    },
    templateData() { }
  },
  notificationConfig: {
    template: {
      [ChangesKinds.FIELD_ADDED]: '{{userName}} set notes of {{{docDesc}}}',
      [ChangesKinds.FIELD_CHANGED]: '{{userName}} changed notes of {{{docDesc}}}',
      [ChangesKinds.FIELD_REMOVED]: '{{userName}} removed notes of {{{docDesc}}}'
    },
    templateData({ diffs: { notes }, newDoc, user }) {
      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
      };
    },
    receivers() { }
  }
};

export const notifyField = {
  logConfig: {
    template: {
      [ChangesKinds.ITEM_ADDED]: '{{item}} was added to notification list',
      [ChangesKinds.ITEM_REMOVED]: '{{item}} was removed from notification list'
    },
    templateData({ diffs: { notify } }) {
      return { item: getUserFullNameOrEmail(notify.item) };
    }
  },
  notificationConfig: {
    template: {
      [ChangesKinds.ITEM_ADDED]:
        '{{userName}} added {{item}} to notification list of {{{docDesc}}}',
      [ChangesKinds.ITEM_REMOVED]:
        '{{userName}} removed {{item}} from notification list of {{{docDesc}}}'
    },
    templateData({ diffs: { notify }, newDoc, user }) {
      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
        item: getUserFullNameOrEmail(notify.item)
      };
    },
    receivers() { }
  }
};

export const ownerIdField = {
  logConfig: {
    template: {
      [ChangesKinds.FIELD_ADDED]: 'Owner set to {{newValue}}',
      [ChangesKinds.FIELD_CHANGED]: 'Owner changed from {{oldValue}} to {{newValue}}',
      [ChangesKinds.FIELD_REMOVED]: 'Owner removed'
    },
    templateData({ diffs: { ownerId } }) {
      return {
        newValue: getUserFullNameOrEmail(ownerId.newValue),
        oldValue: getUserFullNameOrEmail(ownerId.oldValue)
      };
    }
  },
  notificationConfig: {
    template: {
      [ChangesKinds.FIELD_ADDED]:
        '{{userName}} set owner of {{{docDesc}}} to {{newValue}}',
      [ChangesKinds.FIELD_CHANGED]:
        '{{userName}} changed owner of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
      [ChangesKinds.FIELD_REMOVED]:
        '{{userName}} removed owner of {{{docDesc}}}'
    },
    templateData({ diffs: { ownerId }, newDoc, user }) {
      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
        newValue: getUserFullNameOrEmail(ownerId.newValue),
        oldValue: getUserFullNameOrEmail(ownerId.oldValue)
      };
    },
    receivers() { }
  }
};

export const titleField = {
  logConfig: {
    template: {
      [ChangesKinds.FIELD_ADDED]: 'Title set to "{{newValue}}"',
      [ChangesKinds.FIELD_CHANGED]: 'Title changed from "{{oldValue}}" to "{{newValue}}"',
      [ChangesKinds.FIELD_REMOVED]: 'Title removed'
    },
    templateData({ diffs: { title } }) {
      return {
        newValue: title.newValue,
        oldValue: title.oldValue
      };
    }
  },
  notificationConfig: {
    template: {
      [ChangesKinds.FIELD_ADDED]:
        '{{userName}} set title of {{{docDesc}}} to "{{newValue}}"',
      [ChangesKinds.FIELD_CHANGED]:
        '{{userName}} changed title of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
      [ChangesKinds.FIELD_REMOVED]:
        '{{userName}} removed title of {{{docDesc}}}'
    },
    templateData({ diffs: { title }, newDoc, oldDoc, user }) {
      return {
        docDesc: this.docDescription(oldDoc),
        userName: getUserFullNameOrEmail(user),
        newValue: title.newValue,
        oldValue: title.oldValue
      };
    },
    receivers() { }
  }
};
