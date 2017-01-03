import { Departments } from '/imports/share/collections/departments.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'departmentsIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'standards.fields.departmentsIds.item-added',
        [ChangesKinds.ITEM_REMOVED]: 'standards.fields.departmentsIds.item-removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          'standards.fields.departmentsIds.text.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'standards.fields.departmentsIds.text.item-removed',
      }
    }
  ],
  data({ diffs: { departmentsIds }, newDoc, user }) {
    const { item:departmentId } = departmentsIds;
    const department = () => Departments.findOne({ _id: departmentId }) || {};
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      departmentDesc: () => `${department().name} department`,
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers: getReceivers
};
