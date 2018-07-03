import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import TypeList from '../../components/TypeList';
import { getState } from '../../../../store';
import { STANDARD_FILTER_MAP } from '../../../../../api/constants';
import {
  openStandardByFilter,
  getSelectedAndDefaultStandardByFilter,
} from '../../helpers';
import {
  getTypesWithUncategorized,
  getSelectedStandardIsDeleted,
} from '../../../../store/selectors/standards';

const openType = props => setTimeout(() => {
  const urlItemId = getState('global.urlItemId');
  const standardsByIds = getState('collections.standardsByIds');
  const {
    containedIn,
    defaultContainedIn,
    selectedStandard,
  } = getSelectedAndDefaultStandardByFilter({
    urlItemId,
    types: props.types,
    filter: STANDARD_FILTER_MAP.TYPE,
  });

  // if standard does not exist, do not open type.
  // show message that standard does not exist instead.
  if (urlItemId && !standardsByIds[urlItemId]) {
    return;
  }

  // if a type contains selected standard open that type otherwise open default type collapse
  openStandardByFilter({
    selectedStandard,
    containedIn,
    defaultContainedIn,
    dispatch: props.dispatch,
    filter: STANDARD_FILTER_MAP.TYPE,
  });
}, 0);

const mapStateToProps = (state, props) => ({
  types: getTypesWithUncategorized(state, props),
  isSelectedStandardDeleted: getSelectedStandardIsDeleted(state),
});

export default compose(
  connect(mapStateToProps),
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
