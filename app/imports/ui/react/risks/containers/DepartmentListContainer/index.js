import { _ } from 'meteor/underscore';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import DepartmentList from '../../components/DepartmentList';
import {
  getId,
} from '../../../../../api/helpers';
import {
  getSelectedRiskDeletedState,
  createUncategorizedDepartment,
  handleRisksRedirectAndOpen,
  createRiskDepartmentItem,
  withRisksRedirectAndOpen,
} from '../../helpers';
import { getRisksLength } from '../../../../../client/util';

const mapStateToProps = state => ({
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

    types = types.filter(getRisksLength);

    return { ...props, departments: types };
  }),
  // redirect and open on mount only if departments are ready
  withRisksRedirectAndOpen(redirectAndOpen, { processOnMount: property('areDepsReady') }),
)(DepartmentList);
