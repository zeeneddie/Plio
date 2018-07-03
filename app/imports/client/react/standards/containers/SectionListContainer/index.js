import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { propEqType } from '/imports/api/helpers';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';
import SectionList from '../../components/SectionList';
import { getState } from '../../../../store';
import {
  getSelectedAndDefaultStandardByFilter,
  redirectToStandardOrDefault,
  openStandardByFilter,
  getStandardsByFilter,
} from '../../helpers';
import { CollectionNames } from '../../../../../share/constants';
import {
  makeGetSectionsWithUncategorized,
  getStandardsFiltered,
  getSelectedStandardIsDeleted,
} from '../../../../store/selectors/standards';
import { getSearchText } from '../../../../store/selectors/global';

const redirectAndOpen = props => setTimeout(() => {
  const { urlItemId, filter, collapsed } = getState('global');
  const { standardsByIds, standards } = getState('collections');
  const {
    containedIn,
    defaultContainedIn,
    defaultStandard,
    selectedStandard,
  } = getSelectedAndDefaultStandardByFilter({
    urlItemId,
    sections: props.sections,
    filter: STANDARD_FILTER_MAP.SECTION,
  });

  const redirectOptions = { selectedStandard, defaultStandard };

  const redirect = () => redirectToStandardOrDefault(redirectOptions);

  const openSection = () => openStandardByFilter({
    selectedStandard,
    containedIn,
    defaultContainedIn,
    dispatch: props.dispatch,
    filter: STANDARD_FILTER_MAP.SECTION,
  });

  const visibleStds = getStandardsByFilter({ standards, filter });

  // if standard does not exist, do not redirect.
  // show message that standard does not exist instead.
  if (!visibleStds.length || (urlItemId && !standardsByIds[urlItemId])) {
    return;
  }

  // redirect to the selected or default standard
  // and open the section and/or type which contains that standard
  switch (filter) {
    case STANDARD_FILTER_MAP.SECTION:
    default:
      redirect();
      if (!props.searchText) {
        openSection();
      }
      break;
    case STANDARD_FILTER_MAP.TYPE: {
      const { type, defaultType } = props;
      const typeIsDefault = type && defaultType && type._id === defaultType._id;

      // find opened type and open a section in its section list
      const openedType = collapsed.find(propEqType(CollectionNames.STANDARD_TYPES));
      if (openedType && type && type._id === openedType.key) {
        // check if the current type is the default one
        // and redirect to default standard if needed
        if (!props.searchText) {
          if (typeIsDefault) redirect();
          openSection();
        }
      }
    }
  }
}, 0);

const makeMapStateToProps = () => {
  const getSectionsWithUncategorized = makeGetSectionsWithUncategorized();
  const mapStateToProps = (state, props) => ({
    sections: getSectionsWithUncategorized(state, props),
    searchText: getSearchText(state),
    isSelectedStandardDeleted: getSelectedStandardIsDeleted(state),
    standardsFiltered: getStandardsFiltered(state),
  });
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps),
  lifecycle({
    componentWillMount() {
      redirectAndOpen(this.props);
    },
    // redirect to first found standard or
    // if selected standard is deleted redirect to default
    // and open a default section with that standard
    componentWillReceiveProps(nextProps) {
      if ((!this.props.isSelectedStandardDeleted && nextProps.isSelectedStandardDeleted)
          || (nextProps.searchText && nextProps.standardsFiltered.length)) {
        redirectAndOpen(nextProps);
      }
    },
  }),
)(SectionList);
