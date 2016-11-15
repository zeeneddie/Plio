import { compose } from 'recompose';
import { composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';

import { AuditLogs } from '/imports/share/collections/audit-logs';
import { SystemName } from '/imports/share/constants';
import {
  getCollectionByName,
  getFormattedDate,
  getUserFullNameOrEmail,
} from '/imports/share/helpers';
import {
  setChangelogDocument,
  setLastHumanLog,
  setLoadingLastHumanLog,
} from '/client/redux/actions/changelogActions';
import ChangelogHeader from '../../components/ChangelogHeader';
import propTypes from './propTypes';

const onPropsChange = (props, onData) => {
  const { dispatch, documentId, collection } = props;

  const docCollection = getCollectionByName(collection);
  const doc = docCollection && docCollection.findOne({ _id: documentId });
  if (doc) {
    dispatch(setChangelogDocument(doc));
  }

  const sub = Meteor.subscribe('lastHumanLog', documentId, collection);
  dispatch(setLoadingLastHumanLog(true));

  if (sub.ready()) {
    const lastHumanLog = AuditLogs.findOne({
      documentId: doc._id,
      executor: { $ne: SystemName }
    }, {
      sort: { date: -1 },
    });

    if (lastHumanLog) {
      dispatch(setLastHumanLog(lastHumanLog));
    }

    dispatch(setLoadingLastHumanLog(false));
  }

  onData(null, props);

  return () => sub.stop();
};

const mapStateToProps = (state) => {
  const {
    isChangelogCollapsed,
    isLoadingLastHumanLog,
    isLoadingLastLogs,
    lastHumanLog,
    changelogDocument
  } = state.changelog;

  const props = {
    createdAt: '',
    createdBy: '',
    updatedAt: '',
    updatedBy: '',
  };

  const getPrettyDate = date => getFormattedDate(date, 'DD MMM YYYY');

  if (lastHumanLog) {
    Object.assign(props, {
      updatedAt: getPrettyDate(lastHumanLog.date),
      updatedBy: getUserFullNameOrEmail(lastHumanLog.executor),
    });
  }

  if (changelogDocument) {
    Object.assign(props, {
      createdAt: getPrettyDate(changelogDocument.createdAt),
      createdBy: getUserFullNameOrEmail(changelogDocument.createdBy),
    });
  }

  return {
    isChangelogCollapsed,
    isLoadingLastHumanLog,
    isLoadingLastLogs,
    ...props
  };
};

const ChangelogHeaderContainer = compose(
  connect(),
  composeWithTracker(onPropsChange),
  connect(mapStateToProps)
)(ChangelogHeader);

ChangelogHeaderContainer.propTypes = propTypes;

export default ChangelogHeaderContainer;
