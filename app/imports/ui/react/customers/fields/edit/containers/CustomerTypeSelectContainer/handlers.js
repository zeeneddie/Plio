import store from '/client/redux/store';
import { callMethod } from '/client/redux/actions/modalActions';
import { changeCustomerType } from '/imports/api/organizations/methods';

export const onCustomerTypeChange = ({ _id: organizationId }) => (e) => {
  const customerType = parseInt(e.target.value, 10);

  return store.dispatch(callMethod(changeCustomerType, { organizationId, customerType }));
};
