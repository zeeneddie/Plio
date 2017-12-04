import { connect } from 'react-redux';

import MessagesList from '../../components/MessagesList';
import { compose, withProps } from 'recompose';
import { transformMessages } from './helpers.js';
import { transsoc, pickFromDiscussion } from '/imports/api/helpers.js';

export default compose(
  connect(pickFromDiscussion(['at'])),
  withProps(transsoc({
    messages: transformMessages,
  })),
)(MessagesList);
