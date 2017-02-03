import { makeOptionsFields } from '../helpers';
import { Departments } from '/imports/share/collections/departments';

export const getDepartmentsCursorByIds = ({ organizationId, departmentsIds = [] }) => {
  const query = {
    organizationId,
    _id: {
      $in: departmentsIds,
    },
  };
  const options = makeOptionsFields(Departments.publicFields);

  return Departments.find(query, options);
};
