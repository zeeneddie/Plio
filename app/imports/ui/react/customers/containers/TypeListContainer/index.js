import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';

import { _ } from 'meteor/underscore';

import { CustomerTypes } from '/imports/share/constants';
import { propEq } from '/imports/api/helpers';
import { redirectAndOpen } from './helpers';
import TypeList from '../../components/TypeList';
import propTypes from './propTypes';

const CustomersTypeListContainer = compose(
  withProps((props) => {
    const types = _.values(CustomerTypes).reduce((prev, customerType) => {
      const organizations = props.organizations.filter(
        propEq('customerType', customerType)
      );

      return organizations.length
        ? prev.concat({ customerType, organizations })
        : prev;
    }, []);

    return { types };
  }),

  connect(),

  lifecycle({
    componentWillMount() {
      redirectAndOpen(this.props);
    },
  }),
)(TypeList);

CustomersTypeListContainer.propTypes = propTypes;

export default CustomersTypeListContainer;
