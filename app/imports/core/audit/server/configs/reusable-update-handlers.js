import { ChangesKinds } from '../utils/changes-kinds.js';
import { Departments } from '/imports/api/departments/departments.js';
import { Files } from '/imports/api/files/files.js';
import { getUserFullNameOrEmail, getPrettyOrgDate } from '/imports/api/helpers.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

export const departmentsIdsField = {
  logConfig: {
    template: {
      [ITEM_ADDED]: 'Document was linked to {{{departmentDesc}}}',
      [ITEM_REMOVED]: 'Document was unlinked from {{{departmentDesc}}}'
    },
    templateData({ diffs: { departmentsIds } }) {
      const { item:departmentId } = departmentsIds;
      const department = Departments.findOne({ _id: departmentId });

      return {
        departmentDesc: `${department.name} department`
      };
    }
  },
  notificationConfig: {
    template: {
      [ITEM_ADDED]: '{{userName}} linked {{{docDesc}}} to {{{departmentDesc}}}',
      [ITEM_REMOVED]: '{{userName}} unlinked {{{docDesc}}} from {{{departmentDesc}}}'
    },
    templateData({ diffs: { departmentsIds }, newDoc, user }) {
      const { item:departmentId } = departmentsIds;
      const department = Departments.findOne({ _id: departmentId });

      return {
        docDesc: this.docDescription(newDoc),
        departmentDesc: `${department.name} department`,
        userName: getUserFullNameOrEmail(user)
      };
    },
    receivers() { }
  }
};

export const descriptionField = {
  logConfig: {
    template: {
      [FIELD_ADDED]: 'Description set',
      [FIELD_CHANGED]: 'Description changed',
      [FIELD_REMOVED]: 'Description removed'
    },
    templateData() { }
  },
  notificationConfig: {
    template: {
      [FIELD_ADDED]: '{{userName}} set description of {{{docDesc}}}',
      [FIELD_CHANGED]: '{{userName}} changed description of {{{docDesc}}}',
      [FIELD_REMOVED]: '{{userName}} removed description of {{{docDesc}}}'
    },
    templateData({ diffs: { description }, newDoc, user }) {
      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
      };
    },
    receivers() { }
  }
};

export const fileIdsField = {
  logConfig: {
    template: {
      [ITEM_ADDED]: 'File "{{name}}" added',
      [ITEM_REMOVED]: 'File removed'
    },
    templateData({ diffs: { fileIds } }) {
      const { item:_id } = fileIds;
      const { name } = Files.findOne({ _id }) || {};

      return { name };
    }
  },
  notificationConfig: {
    template: {
      [ITEM_ADDED]: '{{userName}} added file "{{name}}" to {{{docDesc}}}',
      [ITEM_REMOVED]: '{{userName}} removed file from {{{docDesc}}}'
    },
    templateData({ diffs: { fileIds }, newDoc, user }) {
      const { item:_id } = fileIds;
      const { name } = Files.findOne({ _id }) || {};

      return {
        name,
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user)
      };
    },
    receivers() { }
  }
};

export const IPDesiredOutcomeField = {
  logConfig: {
    template: {
      [FIELD_ADDED]: 'Improvement plan statement of desired outcome set',
      [FIELD_CHANGED]: 'Improvement plan statement of desired outcome changed',
      [FIELD_REMOVED]: 'Improvement plan statement of desired outcome removed'
    },
    templateData() { }
  },
  notificationConfig: {
    template: {
      [FIELD_ADDED]:
        '{{userName}} set improvement plan\'s statement of desired outcome of {{{docDesc}}}',
      [FIELD_CHANGED]:
        '{{userName}} changed improvement plan\'s statement of desired outcome of {{{docDesc}}}',
      [FIELD_REMOVED]:
        '{{userName}} removed improvement plan\'s statement of desired outcome of {{{docDesc}}}'
    },
    templateData({ newDoc, user }) {
      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user)
      };
    },
    receivers() { }
  }
};

export const IPOwnerField = {
  logConfig: {
    template: {
      [FIELD_ADDED]:
        'Improvement plan owner set to {{newValue}}',
      [FIELD_CHANGED]:
        'Improvement plan owner changed from {{oldValue}} to {{newValue}}',
      [FIELD_REMOVED]:
        'Improvement plan owner removed'
    },
    templateData({ diffs }) {
      const { newValue, oldValue } = diffs['improvementPlan.owner'];

      return {
        newValue: getUserFullNameOrEmail(newValue),
        oldValue: getUserFullNameOrEmail(oldValue)
      };
    }
  },
  notificationConfig: {
    template: {
      [FIELD_ADDED]:
        '{{userName}} set improvement plan\'s owner of {{{docDesc}}} to {{newValue}}',
      [FIELD_CHANGED]:
        '{{userName}} changed improvement plan\'s owner of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
      [FIELD_REMOVED]:
        '{{userName}} removed improvement plan\'s owner of {{{docDesc}}}'
    },
    templateData({ diffs, newDoc, user }) {
      const { newValue, oldValue } = diffs['improvementPlan.owner'];

      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
        newValue: getUserFullNameOrEmail(newValue),
        oldValue: getUserFullNameOrEmail(oldValue)
      };
    },
    receivers() { }
  }
};

export const IPReviewDatesField = {
  logConfig: {
    template: {
      [ITEM_ADDED]: 'Improvement plan review date added: "{{date}}"',
      [ITEM_REMOVED]: 'Improvement plan review date removed: "{{date}}"'
    },
    templateData({ diffs, newDoc }) {
      const { item: { date } } = diffs['improvementPlan.reviewDates'];
      const orgId = this.docOrgId(newDoc);

      return { date: getPrettyOrgDate(date, orgId) };
    }
  },
  notificationConfig: {
    template: {
      [ITEM_ADDED]:
        '{{userName}} added improvement plan\'s review date for {{{docDesc}}}: "{{date}}"',
      [ITEM_REMOVED]:
        '{{userName}} removed improvement plan\'s review date for {{{docDesc}}}: "{{date}}"'
    },
    templateData({ diffs, newDoc, user }) {
      const { item: { date } } = diffs['improvementPlan.reviewDates'];
      const orgId = this.docOrgId(newDoc);

      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
        date: getPrettyOrgDate(date, orgId)
      };
    },
    receivers() { }
  }
};

export const IPReviewDateField = {
  logConfig: {
    template: {
      [FIELD_CHANGED]:
        'Improvement plan review date changed from "{{oldValue}}" to "{{newValue}}"'
    },
    templateData({ diffs, newDoc }) {
      const { newValue, oldValue } = diffs['improvementPlan.reviewDates.$.date'];
      const orgId = this.docOrgId(newDoc);

      return {
        newValue: getPrettyOrgDate(newValue, orgId),
        oldValue: getPrettyOrgDate(oldValue, orgId)
      };
    }
  },
  notificationConfig: {
    template: {
      [FIELD_CHANGED]:
        '{{userName}} changed improvement plan\'s review date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"'
    },
    templateData({ diffs, newDoc, user }) {
      const { newValue, oldValue } = diffs['improvementPlan.reviewDates.$.date'];
      const orgId = this.docOrgId(newDoc);

      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
        newValue: getPrettyOrgDate(newValue, orgId),
        oldValue: getPrettyOrgDate(oldValue, orgId)
      };
    },
    receivers() { }
  }
};

export const IPTargetDateField = {
  logConfig: {
    template: {
      [FIELD_ADDED]:
        'Improvement plan target date for desired outcome set to "{{newValue}}"',
      [FIELD_CHANGED]:
        'Improvement plan target date for desired outcome changed from "{{oldValue}}" to "{{newValue}}"',
      [FIELD_REMOVED]:
        'Improvement plan target date for desired outcome removed'
    },
    templateData({ diffs, newDoc }) {
      const { newValue, oldValue } = diffs['improvementPlan.targetDate'];
      const orgId = this.docOrgId(newDoc);

      return {
        newValue: getPrettyOrgDate(newValue, orgId),
        oldValue: getPrettyOrgDate(oldValue, orgId)
      };
    }
  },
  notificationConfig: {
    template: {
      [FIELD_ADDED]:
        '{{userName}} set improvement plan\'s target date for desired outcome of {{{docDesc}}} to "{{newValue}}"',
      [FIELD_CHANGED]:
        '{{userName}} changed improvement plan\'s target date for desired outcome of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
      [FIELD_REMOVED]:
        '{{userName}} removed improvement plan\'s target date for desired outcome of {{{docDesc}}}'
    },
    templateData({ diffs, newDoc, user }) {
      const { newValue, oldValue } = diffs['improvementPlan.targetDate'];
      const orgId = this.docOrgId(newDoc);

      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
        newValue: getPrettyOrgDate(newValue, orgId),
        oldValue: getPrettyOrgDate(oldValue, orgId)
      };
    },
    receivers() { }
  }
};

export const isDeletedField = {
  logConfig: {
    shouldCreateLog({ diffs: { deletedAt, deletedBy } }) {
      return deletedAt && deletedBy;
    },
    template: {
      [FIELD_CHANGED]:
        '{{#if deleted}}Document was deleted{{else}}Document was restored{{/if}}'
    },
    templateData({ diffs: { isDeleted } }) {
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
    subjectTemplate:
      '{{userName}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}}',
    subjectTemplateData({ diffs: { isDeleted }, newDoc, user }) {
      return {
        docDesc: this.docDescription(newDoc),
        userName: getUserFullNameOrEmail(user),
        deleted: isDeleted.newValue
      };
    },
    receivers() { }
  }
};

export const notesField = {
  logConfig: {
    template: {
      [FIELD_ADDED]: 'Notes set',
      [FIELD_CHANGED]: 'Notes changed',
      [FIELD_REMOVED]: 'Notes removed'
    },
    templateData() { }
  },
  notificationConfig: {
    template: {
      [FIELD_ADDED]: '{{userName}} set notes of {{{docDesc}}}',
      [FIELD_CHANGED]: '{{userName}} changed notes of {{{docDesc}}}',
      [FIELD_REMOVED]: '{{userName}} removed notes of {{{docDesc}}}'
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
      [ITEM_ADDED]: '{{item}} was added to notification list',
      [ITEM_REMOVED]: '{{item}} was removed from notification list'
    },
    templateData({ diffs: { notify } }) {
      return { item: getUserFullNameOrEmail(notify.item) };
    }
  },
  notificationConfig: {
    template: {
      [ITEM_ADDED]:
        '{{userName}} added {{item}} to notification list of {{{docDesc}}}',
      [ITEM_REMOVED]:
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
      [FIELD_ADDED]: 'Owner set to {{newValue}}',
      [FIELD_CHANGED]: 'Owner changed from {{oldValue}} to {{newValue}}',
      [FIELD_REMOVED]: 'Owner removed'
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
      [FIELD_ADDED]:
        '{{userName}} set owner of {{{docDesc}}} to {{newValue}}',
      [FIELD_CHANGED]:
        '{{userName}} changed owner of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
      [FIELD_REMOVED]:
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
      [FIELD_ADDED]: 'Title set to "{{newValue}}"',
      [FIELD_CHANGED]: 'Title changed from "{{oldValue}}" to "{{newValue}}"',
      [FIELD_REMOVED]: 'Title removed'
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
      [FIELD_ADDED]:
        '{{userName}} set title of {{{docDesc}}} to "{{newValue}}"',
      [FIELD_CHANGED]:
        '{{userName}} changed title of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
      [FIELD_REMOVED]:
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
