import { compose, mapProps, shouldUpdate } from 'recompose';
import { compose as kompose } from '@storybook/react-komposer';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

import { AuditLogs } from '/imports/share/collections/audit-logs';
import { LastHumanLogSubs } from '/imports/startup/client/subsmanagers';
import { SystemName } from '/imports/share/constants';
import {
  getFormattedDate,
  getUserFullNameOrEmail,
} from '/imports/share/helpers';
import {
  setChangelogDocument,
  setLastHumanLog,
  setLoadingLastHumanLog,
} from '/imports/client/store/actions/changelogActions';
import { getNormalizedDataKey } from '/imports/client/store/lib/collectionsHelpers';
import { STORE_COLLECTION_NAMES } from '/imports/client/store/lib/constants';
import { shallowCompare, pickFrom } from '/imports/api/helpers';
import ChangelogHeader from '../../components/ChangelogHeader';
import propTypes from './propTypes';
import { composeWithTracker } from '../../../../../client/util';

const getPrettyDate = date => getFormattedDate(date, 'DD MMM YYYY');

const onPropsChange = (props, onData) => {
  let subscription;
  const { dispatch, documentId, collection } = props;

  if (!documentId) {
    onData(null, {});
  } else {
    subscription = LastHumanLogSubs.subscribe('lastHumanLog', documentId, collection);

    dispatch(setLoadingLastHumanLog(true));

    if (subscription.ready()) {
      const lastHumanLog = AuditLogs.findOne({
        documentId,
        executor: { $ne: SystemName },
      }, {
        sort: { date: -1 },
      });

      let actions = [setLoadingLastHumanLog(false)];

      if (lastHumanLog) {
        actions = actions.concat(setLastHumanLog(lastHumanLog));
      }

      dispatch(batchActions(actions));
    }

    onData(null, {});
  }

  return () => typeof subscription === 'function' && subscription.stop();
};

const ChangelogHeaderContainer = compose(
  shouldUpdate((props, nextProps) => props.documentId !== nextProps.documentId),

  connect((state, { documentId, collection }) => ({
    doc: state.collections[getNormalizedDataKey(STORE_COLLECTION_NAMES[collection])][documentId],
  })),

  kompose(({
    documentId, collection, dispatch, doc,
  }, onData) => {
    dispatch(setChangelogDocument(doc));

    onData(null, { documentId, collection, dispatch });
  }),

  composeWithTracker(onPropsChange, {
    propsToWatch: ['documentId'],
  }),

  connect(pickFrom('changelog', [
    'isChangelogCollapsed',
    'isLoadingLastHumanLog',
    'isLoadingLastLogs',
    'lastHumanLog',
    'changelogDocument',
  ])),

  mapProps(({
    lastHumanLog,
    changelogDocument,
    isChangelogCollapsed,
    isLoadingLastHumanLog,
    isLoadingLastLogs,
  }) => {
    const info = {
      createdAt: '',
      createdBy: '',
      updatedAt: '',
      updatedBy: '',
    };

    // TODO: users should be in redux store

    if (lastHumanLog) {
      Object.assign(info, {
        updatedAt: getPrettyDate(lastHumanLog.date),
        updatedBy: getUserFullNameOrEmail(lastHumanLog.executor),
      });
    }

    if (changelogDocument) {
      Object.assign(info, {
        createdAt: getPrettyDate(changelogDocument.createdAt),
        createdBy: getUserFullNameOrEmail(changelogDocument.createdBy),
      });
    }

    return {
      ...info,
      isChangelogCollapsed,
      isLoadingLastHumanLog,
      isLoadingLastLogs,
    };
  }),

  shouldUpdate(shallowCompare),
)(ChangelogHeader);

ChangelogHeaderContainer.propTypes = propTypes;

export default ChangelogHeaderContainer;
