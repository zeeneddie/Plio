import { connect } from 'react-redux';

import MessagesList from '../../components/MessagesList';
import { compose, withProps } from 'recompose';
import { transformMessages } from './helpers';
import { transsoc, pickFromDiscussion } from '/imports/api/helpers';

export default compose(
  connect(pickFromDiscussion(['at'])),
  withProps(transsoc({
    messages: transformMessages,
  })),
)(MessagesList);
