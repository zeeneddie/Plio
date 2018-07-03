import { setFilteredOrganizations } from '/imports/client/store/actions/customersActions';
import { extractIds } from '/imports/api/helpers';
import {
  expandCollapsedCustomers,
  collapseExpandedCustomers,
} from '../../helpers';
import { CUSTOMER_SEQUENTIAL_ID } from '../../constants';
import { onSearchTextClear, onSearch } from '/imports/client/react/share/LHS/handlers';

const transform = ({ name, serialNumber }) => [name, `${CUSTOMER_SEQUENTIAL_ID}${serialNumber}`];

const getItems = ({ organizations }, search) => extractIds(search(transform, organizations));

const getActions = ids => [setFilteredOrganizations(ids)];

export const onSearchTextChange =
  onSearch(getItems, getActions, expandCollapsedCustomers, collapseExpandedCustomers);

export const onClear = onSearchTextClear(onSearchTextChange);
