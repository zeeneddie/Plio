import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import { pickFromStandards } from '/imports/api/helpers';
import StandardsLHS from '../../components/StandardsLHS';

const mapStateToProps = pickFromStandards(['sections']);

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onCollapseShown: props => (e, c) => console.log(props, c),
    onCollapseHidden: props => e => console.log(props)
  })
)(StandardsLHS);
