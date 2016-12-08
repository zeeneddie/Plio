import { compose, shouldUpdate, lifecycle } from 'recompose';
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
} from '/imports/api/helpers';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';
import SectionList from '../../components/SectionList';
import { SECTION_UNCATEGORIZED } from '../../constants';
import { getState } from '/client/redux/store';
import {
  getSelectedAndDefaultStandardByFilter,
  redirect,
  open,
} from '../../helpers';
import { CollectionNames } from '/imports/share/constants';

export default compose(
  shouldUpdate((props, nextProps) => !!(lengthStandards(props) !== lengthStandards(nextProps))),
  connect((state, props) => {
    let sections = state.collections.standardBookSections;
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

    return { sections };
  }),
  shouldUpdate((props, nextProps) => !!(
    lengthSections(props) !== lengthSections(nextProps) ||
    lengthStandards(props) !== lengthStandards(nextProps)
  )),
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
        const redirectToStandard = () => redirect({ selectedStandard, defaultStandard });
        const openSection = () => open({
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
            redirectToStandard();
            openSection();
            break;
          case STANDARD_FILTER_MAP.TYPE: {
            const { type, defaultType } = this.props;
            const openedType = collapsed.find(propEq('type', CollectionNames.STANDARD_TYPES));
            if (openedType && type && type._id === openedType.key) {
              if (type && defaultType && type._id === defaultType._id) {
                redirectToStandard();
              }
              openSection();
            }
          }
        }
      });
    },
  }),
)(SectionList);
