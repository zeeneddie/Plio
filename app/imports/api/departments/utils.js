import { makeOptionsFields } from '../helpers';
import { DepartmentsListProjection } from '../constants';
import { Departments } from '/imports/share/collections/departments';

export const getDepartmentsCursorByIds = ({ organizationId, departmentsIds = [] }) => {
  const query = {
    organizationId,
    _id: {
      $in: departmentsIds
    }
  };
  const options = makeOptionsFields(DepartmentsListProjection);

  return Departments.find(query, options);
}
