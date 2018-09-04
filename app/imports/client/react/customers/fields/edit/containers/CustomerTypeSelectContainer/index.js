import { withHandlers } from 'recompose';

import CustomerTypeSelect from '../../components/CustomerTypeSelect';
import { onCustomerTypeChange as onChange } from './handlers';

export default withHandlers({ onChange })(CustomerTypeSelect);
