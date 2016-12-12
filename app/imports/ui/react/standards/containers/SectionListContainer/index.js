import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';

import {
  propEq,
  lengthStandards,
  getC,
  propEqId,
  sortArrayByTitlePrefix,
} from '/imports/api/helpers';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';
import SectionList from '../../components/SectionList';
import { getState } from '/client/redux/store';
import {
  getSelectedAndDefaultStandardByFilter,
  redirectToStandardOrDefault,
  openStandardByFilter,
  getSelectedStandardDeletedState,
  createUncategorizedSection,
} from '../../helpers';
import { CollectionNames } from '/imports/share/constants';

const redirectAndOpen = (props) => setTimeout(() => {
  const { urlItemId, filter, collapsed } = getState('global');
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
  const redirect = () => redirectToStandardOrDefault({ selectedStandard, defaultStandard });
  const openSection = () => openStandardByFilter({
    selectedStandard,
    containedIn,
    defaultContainedIn,
    dispatch: props.dispatch,
    filter: STANDARD_FILTER_MAP.SECTION,
  });

  // redirect to the selected or default standard
  // and open the section and/or type which contains that standard
  switch (filter) {
    case STANDARD_FILTER_MAP.SECTION:
    default:
      redirect();
      openSection();
      break;
    case STANDARD_FILTER_MAP.TYPE: {
      const { type, defaultType } = props;
      // find opened type and open a section in its section list
      const openedType = collapsed.find(propEq('type', CollectionNames.STANDARD_TYPES));
      if (openedType && type && type._id === openedType.key) {
        // check if the current type is the default one
        // and redirect to default standard if needed
        if (type && defaultType && type._id === defaultType._id) {
          redirect();
        }
        openSection();
      }
    }
  }
}, 0);

const mapStateToProps = (state) => ({
  standardBookSections: state.collections.standardBookSections,
  ...getSelectedStandardDeletedState(state),
});

export default compose(
  connect(mapStateToProps),
  mapProps(({ standardBookSections, standards, ...props }) => {
    let sections = standardBookSections;
    const uncategorized = createUncategorizedSection({ standards, sections });

    // add own standards to each section
    sections = sections.map(section => ({
      ...section,
      standards: standards.filter(propEq('sectionId', section._id)),
    }));

    // add uncategorized section
    sections = sections.concat(uncategorized);

    sections = sections.filter(lengthStandards);

    sections = sortArrayByTitlePrefix(sections);

    return { ...props, sections };
  }),
  lifecycle({
    componentWillMount() {
      redirectAndOpen(this.props);
    },
    // if selected standard is deleted redirect to default
    // and open a default section with that standard
    componentWillReceiveProps(nextProps) {
      if (!this.props.isSelectedStandardDeleted && nextProps.isSelectedStandardDeleted) {
        redirectAndOpen(nextProps);
      }
    },
  }),
)(SectionList);
