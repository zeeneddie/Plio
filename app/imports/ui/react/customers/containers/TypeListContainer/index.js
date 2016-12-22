import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';

import { redirectAndOpen } from './helpers';
import { initCustomerTypes } from '../../helpers';
import TypeList from '../../components/TypeList';
import propTypes from './propTypes';

const CustomersTypeListContainer = compose(
  withProps(initCustomerTypes),

  connect(),

  lifecycle({
    componentWillMount() {
      redirectAndOpen(this.props);
    },
  }),
)(TypeList);

CustomersTypeListContainer.propTypes = propTypes;

export default CustomersTypeListContainer;
