import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';

import TypeList from '../../components/TypeList';
import {
  lengthStandards,
  propEq,
} from '/imports/api/helpers';
import { getState } from '/client/redux/store';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';
import {
  openStandardByFilter,
  getSelectedAndDefaultStandardByFilter,
  getSelectedStandardDeletedState,
  createUncategorizedType,
} from '../../helpers';

const mapStateToProps = (state) => ({
  standardTypes: state.collections.standardTypes,
  ...getSelectedStandardDeletedState(state),
});

const openType = (props) => setTimeout(() => {
  const urlItemId = getState('global.urlItemId');
  const {
    containedIn,
    defaultContainedIn,
    selectedStandard,
  } = getSelectedAndDefaultStandardByFilter({
    urlItemId,
    types: props.types,
    filter: STANDARD_FILTER_MAP.TYPE,
  });

  // if a type contains selected standard open that type otherwise open default type collapse
  openStandardByFilter({
    selectedStandard,
    containedIn,
    defaultContainedIn,
    dispatch: props.dispatch,
    filter: STANDARD_FILTER_MAP.TYPE,
  });
}, 0);

export default compose(
  connect(mapStateToProps),
  mapProps(({ standardTypes, standards, ...props }) => {
    let types = standardTypes;
    const uncategorized = createUncategorizedType({ types, standards });

    // add own standards to each type
    types = types.map(type => ({
      ...type,
      standards: standards.filter(propEq('typeId', type._id)),
    }));

    // add uncategorized type
    types = types.concat(uncategorized);

    types = types.filter(lengthStandards);

    return { ...props, types };
  }),
  lifecycle({
    componentWillMount() {
      openType(this.props);
    },
    // if selected standard is deleted open the default type
    componentWillReceiveProps(nextProps) {
      if (!this.props.isSelectedStandardDeleted && nextProps.isSelectedStandardDeleted) {
        openType(nextProps);
      }
    },
  }),
)(TypeList);
