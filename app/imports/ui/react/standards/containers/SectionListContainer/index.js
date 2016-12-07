import { compose, shouldUpdate, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { propEq, omitC, notEquals } from '/imports/api/helpers';
import SectionList from '../../components/SectionList';

export default compose(
  shouldUpdate(() => false),
  connect(() => state => ({
    sections: state.collections.standardBookSections.map(section => ({
      ...section,
      standards: state.collections.standards.filter(propEq('sectionId', section._id)),
    })),
  })),
  shouldUpdate((props, nextProps) => !!(
    notEquals(
      props.sections.map(omitC(['standards'])),
      nextProps.sections.map(omitC(['standards']))
    )
  )),
  lifecycle({
    componentWillUpdate(nextProps) {
      console.log(this.props.sections, nextProps.sections);
    },
  }),
)(SectionList);
