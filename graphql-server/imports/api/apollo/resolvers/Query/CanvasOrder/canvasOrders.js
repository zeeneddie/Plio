import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  { organizationId },
  { collections: { CanvasOrders } },
) => {
  const cursor = CanvasOrders.find({ organizationId });

  return {
    canvasOrders: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
