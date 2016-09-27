import { Departments } from '/imports/share/collections/departments.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'departmentsIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Document was linked to {{{departmentDesc}}}',
        [ChangesKinds.ITEM_REMOVED]: 'Document was unlinked from {{{departmentDesc}}}'
      }
    }
  },
  notifications: [],
  data({ diffs: { departmentsIds } }) {
    const { item:departmentId } = departmentsIds;
    const department = () => Departments.findOne({ _id: departmentId }) || {};

    return {
      departmentDesc: () => `${department().name} department`,
    };
  }
};
