import { compose, shouldUpdate, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';

import {
  propEq,
  lengthSections,
  lengthStandards,
  notDeleted,
  getC,
  propEqId,
  sortArrayByTitlePrefix,
  pickDeep,
} from '/imports/api/helpers';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';
import SectionList from '../../components/SectionList';
import { SECTION_UNCATEGORIZED } from '../../constants';
import { getState } from '/client/redux/store';
import {
  getSelectedAndDefaultStandardByFilter,
  redirectToStandard,
  openStandardByFilter,
} from '../../helpers';
import { CollectionNames } from '/imports/share/constants';

export default compose(
  connect(pickDeep(['collections.standardBookSections'])),
  mapProps(({ standardBookSections, ...props }) => {
    let sections = standardBookSections;
    const standards = props.standards.filter(notDeleted);
    const uncategorized = {
      _id: SECTION_UNCATEGORIZED,
      title: 'Uncategorized',
      organizationId: getC('organizationId', standards[0]),
      standards: standards.filter(standard => !sections.find(propEqId(standard.sectionId))),
    };

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
      return Meteor.defer(() => {
        const { urlItemId, filter, collapsed } = getState('global');
        const {
          containedIn,
          defaultContainedIn,
          defaultStandard,
          selectedStandard,
        } = getSelectedAndDefaultStandardByFilter({
          urlItemId,
          sections: this.props.sections,
          filter: STANDARD_FILTER_MAP.SECTION,
        });
        const redirect = () => redirectToStandard({ selectedStandard, defaultStandard });
        const openSection = () => openStandardByFilter({
          selectedStandard,
          containedIn,
          defaultContainedIn,
          dispatch: this.props.dispatch,
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
            const { type, defaultType } = this.props;
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
      });
    },
  }),
)(SectionList);
