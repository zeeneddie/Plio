import React from 'react';
import { compose, withHandlers, withProps, shouldUpdate } from 'recompose';
import { connect } from 'react-redux';
import cx from 'classnames';

import RisksListItem from '../../components/RisksListItem';
import _user_ from '/imports/startup/client/mixins/user';
import _date_ from '/imports/startup/client/mixins/date';
import { setUrlItemId } from '/imports/client/store/actions/globalActions';
import { updateViewedBy } from '/imports/api/risks/methods';
import withUpdateViewedBy from '../../../helpers/withUpdateViewedBy';
import { pickC, notEquals } from '/imports/api/helpers';
import { RiskFilterIndexes } from '/imports/api/constants';
import { isNewDoc } from '/imports/api/checkers';
import { getPath } from '/imports/ui/utils/router/paths';
import { getPrimaryScore } from '/imports/api/risks/helpers';
import ListItem from '../../../components/ListItem';
import _problemsStatus_ from '/imports/startup/client/mixins/problemsStatus';

export default compose(
  shouldUpdate((props, nextProps) => Boolean(
    props.orgSerialNumber !== nextProps.orgSerialNumber ||
    props.userId !== nextProps.userId ||
    (props._id !== props.urlItemId && props._id === nextProps.urlItemId) ||
    (props._id === props.urlItemId && props._id !== nextProps.urlItemId)
  )),
  connect((_, { _id }) => (state) => ({
    ...{ ...state.collections.risksByIds[_id] },
  })),
  withProps((props) => ({
    isNew: isNewDoc(props.organization, props.userId, props),
    primaryScore: getPrimaryScore(props.scores),
  })),
  shouldUpdate((props, nextProps) => {
    const pickKeys = pickC([
      'title', 'sequentialId', 'isDeleted',
      'unreadMessagesCount', 'userId', 'isNew',
      'primaryScore',
    ]);
    const pickKeysDeleted = pickC(['deletedByText', 'deletedAtText']);
    return Boolean(
      (props._id !== props.urlItemId && props._id === nextProps.urlItemId) ||
      (props._id === props.urlItemId && props._id !== nextProps.urlItemId) ||
      notEquals(pickKeys(props), pickKeys(nextProps)) ||
      (nextProps.filter === RiskFilterIndexes.DELETED && (
        notEquals(pickKeysDeleted(props), pickKeysDeleted(nextProps))
      ))
    );
  }),
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

      return getPath('risk')(params, queryParams);
    })();
    const isNew = isNewDoc(props.organization, props.userId, props);
    const deletedByText = _user_.userNameOrEmail(props.deletedBy);
    const deletedAtText = _date_.renderDate(props.deletedAt);
    const isActive = props.urlItemId === props._id;
    const className = props.filter === RiskFilterIndexes.STATUS
      ? cx('label', `label-${_problemsStatus_.getClassByStatus(props.status)}`)
      : '';
    const sequentialId = (
      <ListItem.LeftText {...{ className }}>
        {props.sequentialId}
      </ListItem.LeftText>
    );

    return {
      href,
      isNew,
      deletedByText,
      deletedAtText,
      isActive,
      sequentialId,
    };
  }),
  withUpdateViewedBy(updateViewedBy),
)(RisksListItem);
