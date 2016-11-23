import { compose } from 'recompose';
import { composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';

import { AuditLogs } from '/imports/share/collections/audit-logs';
import { setLogs } from '/client/redux/actions/changelogActions';
import { getUser } from '/imports/share/helpers';
import { lastLogsLimit } from '../../constants';
import ChangelogContent from '../../components/ChangelogContent';
import propTypes from './propTypes';

const onPropsChange = (props, onData) => {
  const { dispatch, documentId, collection, showAll } = props;
  const query = { documentId, collection };
  const options = { sort: { date: -1 } };

  if (!showAll) {
    Object.assign(options, { limit: lastLogsLimit });
  }

  const logs = AuditLogs.find(query, options).map(log => (
    Object.assign({}, log, {
      user: getUser(log.executor),
    })
  ));

  dispatch(setLogs(logs));
  onData(null, props);
};

const ChangelogContentContainer = compose(
  connect(state => ({ showAll: state.changelog.showAll })),
  composeWithTracker(onPropsChange),
  connect(state => ({ logs: state.changelog.logs }))
)(ChangelogContent);

ChangelogContentContainer.propTypes = propTypes;

export default ChangelogContentContainer;
