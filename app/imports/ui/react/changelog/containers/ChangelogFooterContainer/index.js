import { compose, mapProps, shallowEqual, shouldUpdate, withHandlers, withProps } from 'recompose';
import { composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { LogsCountSubs } from '/imports/startup/client/subsmanagers';
import Counter from '/imports/api/counter/client';
import {
  setLoadingLogsCount,
  setLogsCount,
  setShowAll,
} from '/client/redux/actions/changelogActions';
import { pickC } from '/imports/api/helpers';
import { lastLogsLimit } from '../../constants';
import ChangelogFooter from '../../components/ChangelogFooter';
import propTypes from './propTypes';

const onPropsChange = (props, onData) => {
  let subscription;
  const { documentId, collection, dispatch } = props;

  if (!documentId) {
    onData(null, props);
  } else {
    const counterName = `doc-logs-count-${documentId}`;

    subscription = LogsCountSubs.subscribe(
      'auditLogsCount',
      counterName,
      documentId,
      collection
    );

    dispatch(setLoadingLogsCount(true));

    if (subscription.ready()) {
      dispatch(batchActions([
        setLoadingLogsCount(false),
        setLogsCount(Counter.get(counterName)),
      ]));
    }

    onData(null, props);
  }

  return () => typeof subscription === 'function' && subscription.stop();
};

const onViewRecentClick = props => () => props.dispatch(setShowAll(false));

const ChangelogFooterContainer = compose(
  connect(),

  composeWithTracker(onPropsChange, null, null, {
    shouldResubscribe: (props, nextProps) =>
      props.documentId !== nextProps.documentId,
  }),

  connect(state => _.pick(state.changelog, [
    'logsCount',
    'isLoadingAllLogs',
    'isAllLogsLoaded',
    'isLoadingLogsCount',
    'showAll',
  ])),

  mapProps(props => Object.assign({}, pickC([
    'logsCount',
    'isLoadingAllLogs',
    'isAllLogsLoaded',
    'isLoadingLogsCount',
    'showAll',
    'onViewAllClick',
  ])(props), {
    lastLogsLimit,
    onViewRecentClick,
  })),

  shouldUpdate((props, nextProps) => !shallowEqual(props, nextProps)),
)(ChangelogFooter);

ChangelogFooterContainer.propTypes = propTypes;

export default ChangelogFooterContainer;
