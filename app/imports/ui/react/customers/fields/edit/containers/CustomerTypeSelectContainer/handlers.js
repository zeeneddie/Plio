import store from '/imports/client/store';
import { callMethod } from '/imports/client/store/actions/modalActions';
import { changeCustomerType } from '/imports/api/organizations/methods';

export const onCustomerTypeChange = ({ _id: organizationId }) => (e) => {
  const customerType = parseInt(e.target.value, 10);

  return store.dispatch(callMethod(changeCustomerType, { organizationId, customerType }));
};
