import React from 'react';
import { connect } from 'react-redux';
import { Tracker } from 'meteor/tracker';
import { compose, lifecycle, withProps } from 'recompose';

import Discussion from '../../components/Discussion';
import { setAt, reset } from '/client/redux/actions/discussionActions';

export default compose(
  connect(),
  lifecycle({
    componentWillMount() {
      const { dispatch, discussionId } = this.props;

      dispatch(setAt(FlowRouter.getQueryParam('at')));
    },
    componentWillUnmount() {
      this.props.dispatch(reset());
    }
  })
)(Discussion);
