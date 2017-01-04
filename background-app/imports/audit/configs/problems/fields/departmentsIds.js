import { Departments } from '/imports/share/collections/departments';
import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'departmentsIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'common.fields.departmentsIds.item-added',
        [ChangesKinds.ITEM_REMOVED]: 'common.fields.departmentsIds.item-removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { departmentsIds } }) {
    const { item: departmentId } = departmentsIds;
    const department = () => Departments.findOne({ _id: departmentId }) || {};

    return {
      departmentDesc: () => `${department().name} department`,
    };
  },
};
