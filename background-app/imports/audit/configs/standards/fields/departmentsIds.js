import { Departments } from '/imports/share/collections/departments';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'departmentsIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'Document was linked to {{{departmentDesc}}}',
        [ChangesKinds.ITEM_REMOVED]:
          'Document was unlinked from {{{departmentDesc}}}',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{userName}} linked {{{docDesc}}} {{{docName}}} to {{{departmentDesc}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} unlinked {{{docDesc}}} {{{docName}}} from {{{departmentDesc}}}',
      },
    },
  ],
  data({ diffs: { departmentsIds } }) {
    const { item: departmentId } = departmentsIds;

    const getDeptName = () => {
      const { name } = Departments.findOne({ _id: departmentId }) || {};
      return `${name} department`;
    };

    return { departmentDesc: getDeptName };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
