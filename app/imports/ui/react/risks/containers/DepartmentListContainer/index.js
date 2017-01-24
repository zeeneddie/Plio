import { _ } from 'meteor/underscore';
import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';

import DepartmentList from '../../components/DepartmentList';
import {
  lengthRisks,
  pickDeep,
  getId,
} from '/imports/api/helpers';
import {
  getSelectedRiskDeletedState,
  createUncategorizedDepartment,
  handleRisksRedirectAndOpen,
  createRiskDepartmentItem,
} from '../../helpers';

const mapStateToProps = (state) => ({
  departments: state.collections.departments,
  ...getSelectedRiskDeletedState(state),
});

const redirectAndOpen = ({ departments, risksByIds, ...props }) => handleRisksRedirectAndOpen(
  compose(createRiskDepartmentItem, getId),
  departments,
  risksByIds,
  props,
);

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
  connect(pickDeep(['global.searchText', 'risks.risksFiltered', 'collections.risksByIds'])),
  lifecycle({
    componentWillMount() {
      redirectAndOpen(this.props);
    },
    // if selected risk is deleted open the default type
    componentWillReceiveProps(nextProps) {
      if ((!this.props.isSelectedRiskDeleted && nextProps.isSelectedRiskDeleted) ||
          (nextProps.searchText && nextProps.risksFiltered.length)) {
        redirectAndOpen(nextProps);
      }
    },
  }),
)(DepartmentList);
