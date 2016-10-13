import { ChangesKinds } from '../utils/changes-kinds.js';
import { Departments } from '/imports/api/departments/departments.js';
import { Files } from '/imports/api/files/files.js';
import { getUserFullNameOrEmail, getPrettyOrgDate, getUserId } from '../utils/helpers.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

export const departmentsIdsField = {
  field: 'departmentsIds',
  logConfig: {
    message: {
      [ITEM_ADDED]: 'Document was linked to {{{departmentDesc}}}',
      [ITEM_REMOVED]: 'Document was unlinked from {{{departmentDesc}}}'
    }
  },
  notificationConfig: {
    text: {
      [ITEM_ADDED]: '{{userName}} linked {{{docDesc}}} to {{{departmentDesc}}}',
      [ITEM_REMOVED]: '{{userName}} unlinked {{{docDesc}}} from {{{departmentDesc}}}'
    }
  },
  data({ diffs: { departmentsIds }, newDoc, user }) {
    const { item:departmentId } = departmentsIds;
    const department = () => Departments.findOne({ _id: departmentId });
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      departmentDesc: () => `${department().name} department`,
      userName: () => getUserFullNameOrEmail(user)
    };
  }
};

export const descriptionField = {
  field: 'description',
  logConfig: {
    message: {
      [FIELD_ADDED]: 'Description set',
      [FIELD_CHANGED]: 'Description changed',
      [FIELD_REMOVED]: 'Description removed'
    }
  },
  notificationConfig: {
    text: {
      [FIELD_ADDED]: '{{userName}} set description of {{{docDesc}}}',
      [FIELD_CHANGED]: '{{userName}} changed description of {{{docDesc}}}',
      [FIELD_REMOVED]: '{{userName}} removed description of {{{docDesc}}}'
    }
  },
  data({ diffs: { description }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
    };
  }
};

export const fileIdsField = {
  field: 'fileIds',
  logConfig: {
    message: {
      [ITEM_ADDED]: 'File "{{{name}}}" added',
      [ITEM_REMOVED]: 'File removed'
    }
  },
  notificationConfig: {
    text: {
      [ITEM_ADDED]: '{{userName}} added file "{{name}}" to {{{docDesc}}}',
      [ITEM_REMOVED]: '{{userName}} removed file from {{{docDesc}}}'
    }
  },
  data({ diffs: { fileIds }, newDoc, user }) {
    const { item:_id } = fileIds;
    const { name } = Files.findOne({ _id }) || {};
    const auditConfig = this;

    return {
      name: () => name,
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user)
    };
  }
};

export const IPDesiredOutcomeField = {
  field: 'improvementPlan.desiredOutcome',
  logConfig: {
    message: {
      [FIELD_ADDED]: 'Improvement plan statement of desired outcome set',
      [FIELD_CHANGED]: 'Improvement plan statement of desired outcome changed',
      [FIELD_REMOVED]: 'Improvement plan statement of desired outcome removed'
    }
  },
  notificationConfig: {
    text: {
      [FIELD_ADDED]:
        '{{userName}} set improvement plan\'s statement of desired outcome of {{{docDesc}}}',
      [FIELD_CHANGED]:
        '{{userName}} changed improvement plan\'s statement of desired outcome of {{{docDesc}}}',
      [FIELD_REMOVED]:
        '{{userName}} removed improvement plan\'s statement of desired outcome of {{{docDesc}}}'
    }
  },
  data({ newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user)
    };
  }
};

export const IPFileIdsField = {
  field: 'improvementPlan.fileIds',
  logConfig: {
    message: {
      [ITEM_ADDED]: 'Improvement plan file "{{name}}" added',
      [ITEM_REMOVED]: 'Improvement plan file removed'
    }
  },
  notificationConfig: {
    text: {
      [ITEM_ADDED]: '{{userName}} added file "{{name}}" to improvement plan of {{{docDesc}}}',
      [ITEM_REMOVED]: '{{userName}} removed file from improvement plan of {{{docDesc}}}'
    }
  },
  data({ diffs, newDoc, user }) {
    const _id = diffs['improvementPlan.fileIds'].item;
    const { name } = Files.findOne({ _id }) || {};
    const auditConfig = this;

    return {
      name: () => name,
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user)
    };
  }
};

export const IPOwnerField = {
  field: 'improvementPlan.owner',
  logConfig: {
    message: {
      [FIELD_ADDED]:
        'Improvement plan owner set to {{newValue}}',
      [FIELD_CHANGED]:
        'Improvement plan owner changed from {{oldValue}} to {{newValue}}',
      [FIELD_REMOVED]:
        'Improvement plan owner removed'
    }
  },
  notificationConfig: {
    text: {
      [FIELD_ADDED]:
        '{{userName}} set improvement plan\'s owner of {{{docDesc}}} to {{newValue}}',
      [FIELD_CHANGED]:
        '{{userName}} changed improvement plan\'s owner of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
      [FIELD_REMOVED]:
        '{{userName}} removed improvement plan\'s owner of {{{docDesc}}}'
    }
  },
  data({ diffs, newDoc, user }) {
    const { newValue, oldValue } = diffs['improvementPlan.owner'];
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  }
};

export const IPReviewDatesField = {
  field: 'improvementPlan.reviewDates',
  logConfig: {
    message: {
      [ITEM_ADDED]: 'Improvement plan review date added: "{{date}}"',
      [ITEM_REMOVED]: 'Improvement plan review date removed: "{{date}}"'
    }
  },
  notificationConfig: {
    text: {
      [ITEM_ADDED]:
        '{{userName}} added improvement plan\'s review date for {{{docDesc}}}: "{{date}}"',
      [ITEM_REMOVED]:
        '{{userName}} removed improvement plan\'s review date for {{{docDesc}}}: "{{date}}"'
    }
  },
  data({ diffs, newDoc, user }) {
    const { item: { date } } = diffs['improvementPlan.reviewDates'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      date: () => getPrettyOrgDate(date, orgId())
    };
  }
};

export const IPReviewDateField = {
  field: 'improvementPlan.reviewDates.$.date',
  logConfig: {
    message: {
      [FIELD_CHANGED]:
        'Improvement plan review date changed from "{{oldValue}}" to "{{newValue}}"'
    }
  },
  notificationConfig: {
    text: {
      [FIELD_CHANGED]:
        '{{userName}} changed improvement plan\'s review date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"'
    }
  },
  data({ diffs, newDoc, user }) {
    const { newValue, oldValue } = diffs['improvementPlan.reviewDates.$.date'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId())
    };
  }
};

export const IPTargetDateField = {
  field: 'improvementPlan.targetDate',
  logConfig: {
    message: {
      [FIELD_ADDED]:
        'Improvement plan target date for desired outcome set to "{{newValue}}"',
      [FIELD_CHANGED]:
        'Improvement plan target date for desired outcome changed from "{{oldValue}}" to "{{newValue}}"',
      [FIELD_REMOVED]:
        'Improvement plan target date for desired outcome removed'
    }
  },
  notificationConfig: {
    text: {
      [FIELD_ADDED]:
        '{{userName}} set improvement plan\'s target date for desired outcome of {{{docDesc}}} to "{{newValue}}"',
      [FIELD_CHANGED]:
        '{{userName}} changed improvement plan\'s target date for desired outcome of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
      [FIELD_REMOVED]:
        '{{userName}} removed improvement plan\'s target date for desired outcome of {{{docDesc}}}'
    }
  },
  data({ diffs, newDoc, user }) {
    const { newValue, oldValue } = diffs['improvementPlan.targetDate'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId())
    };
  }
};

export const isDeletedField = {
  field: 'isDeleted',
  logConfig: {
    shouldCreateLog({ diffs: { deletedAt, deletedBy } }) {
      return deletedAt && deletedBy;
    },
    message: {
      [FIELD_CHANGED]:
        '{{#if deleted}}Document was deleted{{else}}Document was restored{{/if}}'
    }
  },
  notificationConfig: {
    shouldSendNotification({ diffs: { deletedAt, deletedBy } }) {
      return deletedAt && deletedBy;
    },
    text: {
      [ChangesKinds.FIELD_CHANGED]:
        '{{userName}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}}'
    },
    title: {
      [ChangesKinds.FIELD_CHANGED]:
        '{{userName}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}}'
    }
  },
  data({ diffs: { isDeleted }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      deleted: () => isDeleted.newValue
    };
  }
};

export const notesField = {
  field: 'notes',
  logConfig: {
    message: {
      [FIELD_ADDED]: 'Notes set',
      [FIELD_CHANGED]: 'Notes changed',
      [FIELD_REMOVED]: 'Notes removed'
    }
  },
  notificationConfig: {
    text: {
      [FIELD_ADDED]: '{{userName}} set notes of {{{docDesc}}}',
      [FIELD_CHANGED]: '{{userName}} changed notes of {{{docDesc}}}',
      [FIELD_REMOVED]: '{{userName}} removed notes of {{{docDesc}}}'
    }
  },
  data({ diffs: { notes }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user)
    };
  }
};

export const notifyField = {
  field: 'notify',
  logConfig: {
    message: {
      [ITEM_ADDED]: '{{item}} was added to notification list',
      [ITEM_REMOVED]: '{{item}} was removed from notification list'
    }
  },
  notificationConfig: {
    text: {
      [ITEM_ADDED]:
        '{{userName}} added {{item}} to the notification list of {{{docDesc}}}',
      [ITEM_REMOVED]:
        '{{userName}} removed {{item}} from the notification list of {{{docDesc}}}'
    }
  },
  personalNotificationConfig: {
    shouldSendNotification({ diffs: { notify: { kind } } }) {
      return kind === ITEM_ADDED;
    },
    text: '{{userName}} added you to the notification list of {{{docDesc}}}',
    title: 'You have been added to the notification list',
    emailTemplateData({ newDoc }) {
      return {
        button: {
          label: 'View document',
          url: this.docUrl(newDoc)
        }
      };
    },
    receivers({ diffs: { notify }, user }) {
      const { item:addedUserId } = notify;
      const userId = getUserId(user);

      return (addedUserId !== userId) ? [addedUserId]: [];
    }
  },
  data({ diffs: { notify }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      item: () => getUserFullNameOrEmail(notify.item)
    };
  }
};

export const ownerIdField = {
  field: 'ownerId',
  logConfig: {
    message: {
      [FIELD_ADDED]: 'Owner set to {{newValue}}',
      [FIELD_CHANGED]: 'Owner changed from {{oldValue}} to {{newValue}}',
      [FIELD_REMOVED]: 'Owner removed'
    }
  },
  notificationConfig: {
    text: {
      [FIELD_ADDED]:
        '{{userName}} set owner of {{{docDesc}}} to {{newValue}}',
      [FIELD_CHANGED]:
        '{{userName}} changed owner of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
      [FIELD_REMOVED]:
        '{{userName}} removed owner of {{{docDesc}}}'
    }
  },
  data({ diffs: { ownerId }, newDoc, user }) {
    const { newValue, oldValue } = ownerId;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  }
};

export const titleField = {
  field: 'title',
  logConfig: {
    message: {
      [FIELD_ADDED]: 'Title set to "{{newValue}}"',
      [FIELD_CHANGED]: 'Title changed from "{{oldValue}}" to "{{newValue}}"',
      [FIELD_REMOVED]: 'Title removed'
    }
  },
  notificationConfig: {
    text: {
      [FIELD_ADDED]:
        '{{userName}} set title of {{{docDesc}}} to "{{newValue}}"',
      [FIELD_CHANGED]:
        '{{userName}} changed title of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
      [FIELD_REMOVED]:
        '{{userName}} removed title of {{{docDesc}}}'
    }
  },
  data({ diffs: { title }, newDoc, oldDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(oldDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => title.newValue,
      oldValue: () => title.oldValue
    };
  }
};
