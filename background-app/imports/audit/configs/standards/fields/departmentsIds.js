import { Departments } from '/imports/share/collections/departments';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


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
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          'common.fields.departmentsIds.text.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'common.fields.departmentsIds.text.item-removed',
      },
    },
  ],
  data({ diffs: { departmentsIds }, newDoc, user }) {
    const { item: departmentId } = departmentsIds;
    const department = () => Departments.findOne({ _id: departmentId }) || {};
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      departmentDesc: () => `${department().name} department`,
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers: getReceivers,
};
