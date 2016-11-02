import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import { pickFromStandards, propEq, mapByIndex, assoc } from '/imports/api/helpers';
import StandardsLHS from '../../components/StandardsLHS';
import { toggleSectionCollapsed } from '/client/redux/actions/standardsActions';

const mapStateToProps = pickFromStandards(['sections']);

const collapse = ({ dispatch, sections }) => (e, section, collapsed) => {
  const index = sections.findIndex(propEq('_id', section._id));

  if (index === -1) return;

  if (sections[index].collapsed === collapsed) return;

  dispatch(toggleSectionCollapsed(index, true));
};

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onCollapseShown: collapse,
    onCollapseHidden: collapse
  })
)(StandardsLHS);
