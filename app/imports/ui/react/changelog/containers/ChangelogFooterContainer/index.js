import { compose, mapProps, withHandlers, shouldUpdate } from 'recompose';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

import { LogsCountSubs } from '/imports/startup/client/subsmanagers';
import Counter from '/imports/api/counter/client';
import {
  setLoadingLogsCount,
  setLogsCount,
  setShowAll,
} from '/imports/client/store/actions/changelogActions';
import { pickC, shallowCompare } from '/imports/api/helpers';
import { lastLogsLimit } from '../../constants';
import ChangelogFooter from '../../components/ChangelogFooter';
import propTypes from './propTypes';
import { composeWithTracker } from '../../../../../client/util';

const onPropsChange = (props, onData) => {
  let subscription;
  const { documentId, collection, dispatch } = props;

  if (!documentId) {
    onData(null, {});
  } else {
    const counterName = `doc-logs-count-${documentId}`;

    subscription = LogsCountSubs.subscribe(
      'auditLogsCount',
      counterName,
      documentId,
      collection,
    );

    dispatch(setLoadingLogsCount(true));

    if (subscription.ready()) {
      dispatch(batchActions([
        setLoadingLogsCount(false),
        setLogsCount(Counter.get(counterName)),
      ]));
    }

    onData(null, {});
  }

  return () => typeof subscription === 'function' && subscription.stop();
};

const onViewRecentClick = props => () => props.dispatch(setShowAll(false));

const ChangelogFooterContainer = compose(
  connect(),

  composeWithTracker(onPropsChange, {
    propsToWatch: ['documentId'],
  }),

  connect(state => pickC([
    'logsCount',
    'isLoadingAllLogs',
    'isAllLogsLoaded',
    'isLoadingLogsCount',
    'showAll',
  ], state.changelog)),

  mapProps(props => Object.assign({}, pickC([
    'dispatch',
    'logsCount',
    'isLoadingAllLogs',
    'isAllLogsLoaded',
    'isLoadingLogsCount',
    'showAll',
    'onViewAllClick',
  ], props), {
    lastLogsLimit,
  })),

  withHandlers({ onViewRecentClick }),

  shouldUpdate(shallowCompare),
)(ChangelogFooter);

ChangelogFooterContainer.propTypes = propTypes;

export default ChangelogFooterContainer;
