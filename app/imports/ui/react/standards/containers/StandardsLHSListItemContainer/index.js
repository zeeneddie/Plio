import { compose, withHandlers, withProps, shouldUpdate } from 'recompose';
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
import { pickC, notEquals } from '/imports/api/helpers';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';

export default compose(
  shouldUpdate((props, nextProps) => {
    const pickKeys = pickC([
      'title', 'status', 'isDeleted',
      'unreadMessagesCount', 'userId', 'filter',
    ]);
    const pickKeysDeleted = pickC(['deletedByText', 'deletedAtText']);
    return !!(
      (props._id !== props.urlItemId && props._id === nextProps.urlItemId) ||
      (props._id === props.urlItemId && props._id !== nextProps.urlItemId) ||
      (nextProps.status === 'draft' && props.issueNumber !== nextProps.issueNumber) ||
      ((props.type && props.type.title) !== (nextProps.type && nextProps.type.title)) ||
      notEquals(pickKeys(props), pickKeys(nextProps)) ||
      (nextProps.filter === STANDARD_FILTER_MAP.DELETED && (
        notEquals(pickKeysDeleted(props), pickKeysDeleted(nextProps))
      ))
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
