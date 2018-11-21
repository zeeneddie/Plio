import { Projects } from '../../share/collections';

export const getProjectsCursorByIds = ({ organizationId, projectIds = [] }) => {
  const query = {
    organizationId,
    _id: {
      $in: projectIds,
    },
  };
  const options = {
    fields: Projects.publicFields,
  };
  return Projects.find(query, options);
};
