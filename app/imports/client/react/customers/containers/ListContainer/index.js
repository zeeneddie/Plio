import { connect } from 'react-redux';
import { compose } from 'recompose';

import { pickDeep } from '/imports/api/helpers';
import CustomersList from '../../components/List';
import propTypes from './propTypes';

const CustomersListContainer = compose(connect(pickDeep([
  'global.urlItemId',
])))(CustomersList);

CustomersListContainer.propTypes = propTypes;

export default CustomersListContainer;
