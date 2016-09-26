import React from 'react';
import { connect } from 'react-redux';
import { Tracker } from 'meteor/tracker';

import Discussion from '../../components/Discussion';
import { setAt, reset } from '/client/redux/actions/discussionActions';
import { bulkUpdateViewedBy } from '/imports/api/messages/methods.js';

class DiscussionContainer extends React.Component {
  componentWillMount() {
    const { dispatch, discussionId } = this.props;

    bulkUpdateViewedBy.call({ discussionId });

    dispatch(setAt(FlowRouter.getQueryParam('at')));
  }

  componentWillUnmount() {
    this.props.dispatch(reset());
  }

  render() {
    return (<Discussion {...this.props}/>);
  }
}

export default connect()(DiscussionContainer);
