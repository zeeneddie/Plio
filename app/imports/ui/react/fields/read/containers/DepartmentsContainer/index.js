import { connect } from 'react-redux';
import { compose, mapProps, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';

import Departments from '../../components/Departments';
import { pickDeep } from '/imports/api/helpers';

export default compose(
  setPropTypes({
    departmentsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  connect(pickDeep(['collections.departmentsByIds'])),
  mapProps(props => ({
    ...props,
    departments: props.departmentsIds.map(_id => props.departmentsByIds[_id]).filter(Boolean),
  })),
)(Departments);
