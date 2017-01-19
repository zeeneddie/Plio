import { _ } from 'meteor/underscore';
import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';

import DepartmentList from '../../components/DepartmentList';
import {
  lengthRisks,
} from '/imports/api/helpers';
import { getState } from '/imports/client/store';
import { RiskFilterIndexes } from '/imports/api/constants';
import {
  openRiskByFilter,
  getSelectedAndDefaultRiskByFilter,
  getSelectedRiskDeletedState,
  createUncategorizedDepartment,
} from '../../helpers';

const mapStateToProps = (state) => ({
  departments: state.collections.departments,
  ...getSelectedRiskDeletedState(state),
});

const openType = (props) => setTimeout(() => {
  const urlItemId = getState('global.urlItemId');
  const risksByIds = getState('collections.risksByIds');
  const {
    containedIn,
    defaultContainedIn,
    selectedRisk,
  } = getSelectedAndDefaultRiskByFilter({
    urlItemId,
    departments: props.departments,
    filter: RiskFilterIndexes.DEPARTMENT,
  });

  // if risk does not exist, do not open type.
  // show message that risk does not exist instead.
  if (urlItemId && !risksByIds[urlItemId]) {
    return;
  }

  // if a type contains selected risk open that type otherwise open default type collapse
  openRiskByFilter({
    selectedRisk,
    containedIn,
    defaultContainedIn,
    dispatch: props.dispatch,
    filter: RiskFilterIndexes.DEPARTMENT,
  });
}, 0);

export default compose(
  connect(mapStateToProps),
  mapProps(({ departments, risks, ...props }) => {
    let types = departments;
    const uncategorized = createUncategorizedDepartment({ departments: types, risks });

    // add own risks to each type
    types = types.map(type => ({
      ...type,
      risks: risks.filter(risk => _.contains(risk.departmentsIds, type._id)),
    }));
    // add uncategorized type
    types = types.concat(uncategorized);

    types = types.filter(lengthRisks);

    return { ...props, departments: types };
  }),
  lifecycle({
    componentWillMount() {
      openType(this.props);
    },
    // if selected risk is deleted open the default type
    componentWillReceiveProps(nextProps) {
      if (!this.props.isSelectedRiskDeleted && nextProps.isSelectedRiskDeleted) {
        openType(nextProps);
      }
    },
  }),
)(DepartmentList);
