import { compose, lifecycle, withProps, withHandlers } from 'recompose';
import invoke from 'lodash.invoke';
import property from 'lodash.property';

import { transsoc } from '/imports/api/helpers';
import Message from '../../components/Message';
import { isAuthor } from '/imports/ui/react/discussion/helpers';
import { getAvatar, getFirstName, getFullNameOrEmail } from '/imports/api/users/helpers';
import {
  getMessagePath,
  getMessageTime,
  getMessageContents,
  getPathToMessageToCopy,
  getClassName,
} from './helpers';

import {
  openUserDetails,
  select,
  deselect,
  remove,
} from './handlers';

const propUser = property('user');
const withUser = fn => compose(fn, propUser);

export default compose(
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return this.props._id === nextProps.at ||
             (this.props.at === this.props._id && !nextProps.at) ||
             (this.props.at === this.props._id && nextProps.at !== this.props._id) ||
             !this.props.isMergedWithPreviousMessage && nextProps.isMergedWithPreviousMessage;
    },
    componentDidMount() {
      if (this.props.isSelected) {
        invoke(this.props, 'scrollToSelectedMessage', this);
      }
    },
  }),
  withHandlers({
    onMessageAvatarClick: openUserDetails,
    onMessageContentsClick: deselect,
    onMessageTimeClick: select,
    onMessageDelete: remove,
  }),
  withProps(transsoc({
    isAuthor,
    userAvatar: withUser(getAvatar),
    userFirstName: withUser(getFirstName),
    userFullNameOrEmail: withUser(getFullNameOrEmail),
    pathToMessage: getMessagePath,
    time: getMessageTime,
    contents: getMessageContents,
    pathToMessageToCopy: getPathToMessageToCopy,
    className: getClassName,
  })),
)(Message);
