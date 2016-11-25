import { connect } from 'react-redux';
import { compose, mapProps, setPropTypes } from 'recompose';
import { PropTypes } from 'react';

import DepartmentsRead from '../../components/DepartmentsRead';
import { pickFromCollections } from '/imports/api/helpers';

const mapStateToProps = pickFromCollections(['departments']);

export default compose(
  setPropTypes({
    departmentsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  connect(mapStateToProps),
  mapProps(props => ({
    ...props,
    departments: props.departments.filter(department =>
      props.departmentsIds.includes(department._id)),
  })),
)(DepartmentsRead);
