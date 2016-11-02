import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import { pickFromStandards, propEq, mapByIndex, assoc } from '/imports/api/helpers';
import StandardsLHS from '../../components/StandardsLHS';
import { toggleSectionCollapsed, closeCollapsibles } from '/client/redux/actions/standardsActions';

const mapStateToProps = pickFromStandards(['sections']);

const onToggleCollapse = ({ dispatch, sections }) => (e, props) => {
  const index = sections.findIndex(propEq('_id', props.item._id));

  if (index === -1) return;

  dispatch(toggleSectionCollapsed(index, true));
};

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onToggleCollapse
  })
)(StandardsLHS);
