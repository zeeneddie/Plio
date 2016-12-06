import { compose, shouldUpdate, withProps, branch, renderNothing } from 'recompose';
import { connect } from 'react-redux';

import { identity, lengthStandards } from '/imports/api/helpers';
import SectionListItem from '../../components/SectionListItem';

export default compose(
  connect((_, { _id }) => state => ({
    ...state.collections.standardBookSectionsByIds[_id],
  })),
  shouldUpdate((props, nextProps) => props.title !== nextProps.title),
  branch(
    lengthStandards,
    identity,
    renderNothing,
  ),
)(SectionListItem);
