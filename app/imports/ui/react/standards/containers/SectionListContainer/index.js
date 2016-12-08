import { compose, shouldUpdate } from 'recompose';
import { connect } from 'react-redux';

import {
  propEq,
  lengthSections,
  lengthStandards,
  notDeleted,
  getC,
  propEqId,
  sortArrayByTitlePrefix,
} from '/imports/api/helpers';
import { SECTION_UNCATEGORIZED } from '../../constants';
import SectionList from '../../components/SectionList';

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
)(SectionList);
