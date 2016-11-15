import { compose, withHandlers } from 'recompose';
import { composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { Meteor } from 'meteor/meteor';

import Counter from '/imports/api/counter/client';
import {
  setLoadingLogsCount,
  setLogsCountLoaded,
  setLogsCount,
  setShowAll,
} from '/client/redux/actions/changelogActions';
import ChangelogFooter from '../../components/ChangelogFooter';

const onPropsChange = (props, onData) => {
  const { documentId, collection, dispatch } = props;
  const counterName = `doc-logs-count-${documentId}`;

  const sub = Meteor.subscribe(
    'auditLogsCount',
    counterName,
    documentId,
    collection
  );
  dispatch(setLoadingLogsCount(true));

  if (sub.ready()) {
    const logsCount = Counter.get(counterName);

    dispatch(batchActions([
      setLoadingLogsCount(false),
      setLogsCount(logsCount),
      setLogsCountLoaded(true)
    ]));
  }

  onData(null, props);
};

const mapStateToProps = state => _.pick(state.changelog, [
  'logsCount',
  'isLoadingAllLogs',
  'isAllLogsLoaded',
  'isLoadingLogsCount',
  'showAll',
]);

const onViewRecentClick = props => () => props.dispatch(setShowAll(false));

export default compose(
  connect(),
  composeWithTracker(onPropsChange),
  connect(mapStateToProps),
  withHandlers({ onViewRecentClick })
)(ChangelogFooter);
