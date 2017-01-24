import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';

import TypeList from '../../components/TypeList';
import {
  lengthRisks,
  propEq,
  pickDeep,
  getId,
} from '/imports/api/helpers';
import {
  getSelectedRiskDeletedState,
  createUncategorizedType,
  createRiskTypeItem,
  handleRisksRedirectAndOpen,
} from '../../helpers';

const mapStateToProps = (state) => ({
  riskTypes: state.collections.riskTypes,
  ...getSelectedRiskDeletedState(state),
});

const redirectAndOpen = ({ types, risksByIds, ...props }) => handleRisksRedirectAndOpen(
  compose(createRiskTypeItem, getId),
  types,
  risksByIds,
  props,
);

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
)(TypeList);
