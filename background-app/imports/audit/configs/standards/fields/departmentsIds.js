import { Departments } from '/imports/share/collections/departments.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'departmentsIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'Document was linked to {{{departmentDesc}}}',
        [ChangesKinds.ITEM_REMOVED]:
          'Document was unlinked from {{{departmentDesc}}}'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{userName}} linked {{{docDesc}}} to {{{departmentDesc}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} unlinked {{{docDesc}}} from {{{departmentDesc}}}'
      }
    }
  ],
  data({ diffs: { departmentsIds }, newDoc, user }) {
    const { item:departmentId } = departmentsIds;
    const department = () => Departments.findOne({ _id: departmentId }) || {};
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      departmentDesc: () => `${department().name} department`,
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers: getReceivers
};
