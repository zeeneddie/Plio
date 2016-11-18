import { compose, withHandlers, withProps, shouldUpdate, shallowEqual } from 'recompose';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { connect } from 'react-redux';

import { getSubNestingClassName } from '../../helpers';
import StandardsLHSListItem from '../../components/StandardsLHSListItem';
import _organization_ from '/imports/startup/client/mixins/organization';
import _user_ from '/imports/startup/client/mixins/user';
import _date_ from '/imports/startup/client/mixins/date';
import { setUrlItemId } from '/client/redux/actions/globalActions';
import { updateViewedBy } from '/imports/api/standards/methods';
import withUpdateViewedBy from '../../../helpers/withUpdateViewedBy';
import { pickC } from '/imports/api/helpers';

// TODO: unreadMessagesCount support
export default compose(
  shouldUpdate((props, nextProps) => {
    const pickKeys = pickC([
      'title', 'issueNumber', 'isDeleted', 'deletedByText', 'deletedAtText',
      'unreadMessagesCount', 'userId', 'filter',
    ]);
    return !!(
      (props._id !== props.urlItemId && props._id === nextProps.urlItemId) ||
      (props._id === props.urlItemId && props._id !== nextProps.urlItemId) ||
      ((props.type && props.type.title) !== (nextProps.type && nextProps.type.title)) ||
      !shallowEqual(pickKeys(props), pickKeys(nextProps))
    );
  }),
  connect(),
  withHandlers({
    onClick: props => handler => {
      props.dispatch(setUrlItemId(props._id));

      handler({ urlItemId: props._id });
    },
  }),
  withProps((props) => {
    const href = (() => {
      const params = {
        urlItemId: props._id,
        orgSerialNumber: props.orgSerialNumber,
      };
      const queryParams = {
        filter: props.filter || 1,
      };

      return FlowRouter.path('standard', params, queryParams);
    })();
    const className = getSubNestingClassName(props);
    const isNew = _organization_.isNewDoc({ doc: props, userId: props.userId });
    const deletedByText = _user_.userNameOrEmail(props.deletedBy);
    const deletedAtText = _date_.renderDate(props.deletedAt);
    const isActive = props.urlItemId === props._id;

    return {
      href,
      className,
      isNew,
      deletedByText,
      deletedAtText,
      isActive,
    };
  }),
  withUpdateViewedBy(updateViewedBy),
)(StandardsLHSListItem);
