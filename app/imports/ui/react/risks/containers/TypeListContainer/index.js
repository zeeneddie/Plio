import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';

import TypeList from '../../components/TypeList';
import {
  lengthRisks,
  propEq,
  pickDeep,
} from '/imports/api/helpers';
import { getState } from '/imports/client/store';
import { RiskFilterIndexes } from '/imports/api/constants';
import {
  openRiskByFilter,
  getSelectedAndDefaultRiskByFilter,
  getSelectedRiskDeletedState,
  createUncategorizedType,
  redirectToRiskOrDefault,
} from '../../helpers';

const mapStateToProps = (state) => ({
  riskTypes: state.collections.riskTypes,
  ...getSelectedRiskDeletedState(state),
});

const redirectAndOpen = (props) => setTimeout(() => {
  const state = getState();
  const { global: { urlItemId }, collections: { risksByIds } } = state;
  const {
    containedIn,
    defaultContainedIn,
    selectedRisk,
    defaultRisk,
  } = getSelectedAndDefaultRiskByFilter({
    urlItemId,
    types: props.types,
    filter: RiskFilterIndexes.TYPE,
  });

  let redirectOptions = { selectedRisk, defaultRisk };
  if (props.searchText) redirectOptions = { defaultRisk };

  const redirect = () => redirectToRiskOrDefault(redirectOptions);

  const openType = () => openRiskByFilter({
    selectedRisk,
    containedIn,
    defaultContainedIn,
    dispatch: props.dispatch,
    filter: RiskFilterIndexes.SECTION,
  });

  // if risk does not exist, do not open type.
  // show message that risk does not exist instead.
  if (urlItemId && !risksByIds[urlItemId]) return;

  // redirect to the selected or default risk
  // and open the type which contains that standard
  redirect();
  if (!props.searchText) openType();
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
  connect(pickDeep(['global.searchText', 'risks.risksFiltered'])),
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
)(TypeList);
