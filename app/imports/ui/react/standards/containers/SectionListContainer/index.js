import { compose, shouldUpdate } from 'recompose';
import { connect } from 'react-redux';

import { propEq, lengthSections, lengthStandards } from '/imports/api/helpers';
import SectionList from '../../components/SectionList';

export default compose(
  shouldUpdate((props, nextProps) => !!(lengthStandards(props) !== lengthStandards(nextProps))),
  connect((_, { standards }) => state => ({
    sections: state.collections.standardBookSections.map(section => ({
      ...section,
      standards: standards.filter(propEq('sectionId', section._id)),
    })).filter(lengthStandards),
  })),
  shouldUpdate((props, nextProps) => !!(
    lengthSections(props) !== lengthSections(nextProps) ||
    lengthStandards(props) !== lengthStandards(nextProps)
  )),
)(SectionList);
