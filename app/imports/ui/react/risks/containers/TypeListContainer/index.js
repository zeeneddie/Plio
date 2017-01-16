import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';

import TypeList from '../../components/TypeList';
import {
  lengthRisks,
  propEq,
} from '/imports/api/helpers';
import { getState } from '/imports/client/store';
import { RiskFilterIndexes } from '/imports/api/constants';
import {
  openRiskByFilter,
  getSelectedAndDefaultRiskByFilter,
  getSelectedRiskDeletedState,
  createUncategorizedType,
} from '../../helpers';

const mapStateToProps = (state) => ({
  riskTypes: state.collections.riskTypes,
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
    types: props.types,
    filter: RiskFilterIndexes.TYPE,
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
    filter: RiskFilterIndexes.TYPE,
  });
}, 0);

export default compose(
  connect(mapStateToProps),
  mapProps(({ riskTypes, risks, ...props }) => {
    let types = riskTypes;
    const uncategorized = createUncategorizedType({ types, risks });

    // add own risks to each type
    types = types.map(type => ({
      ...type,
      risks: risks.filter(propEq('typeId', type._id)),
    }));

    // add uncategorized type
    types = types.concat(uncategorized);

    types = types.filter(lengthRisks);

    return { ...props, types };
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
)(TypeList);
