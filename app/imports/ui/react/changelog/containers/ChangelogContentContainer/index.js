import { compose } from 'recompose';
import { composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';

import { AuditLogs } from '/imports/share/collections/audit-logs';
import { setLogs } from '/client/redux/actions/changelogActions';
import { getUser } from '/imports/share/helpers';
import ChangelogContent from '../../components/ChangelogContent';
import propTypes from './propTypes';

const onPropsChange = (props, onData) => {
  const { dispatch, documentId, collection } = props;
  const logs = AuditLogs.find({ documentId, collection }).map((log) => {
    return Object.assign({}, log, {
      user: getUser(log.executor)
    });
  });

  dispatch(setLogs(logs));
  onData(null, {});
};

const ChangelogContentContainer = compose(
  connect(),
  composeWithTracker(onPropsChange),
  connect(state => ({ logs: state.changelog.logs }))
)(ChangelogContent);

ChangelogContentContainer.propTypes = propTypes;

export default ChangelogContentContainer;
