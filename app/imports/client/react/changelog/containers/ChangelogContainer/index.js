import { compose, mapProps, shouldUpdate, withHandlers } from 'recompose';
import { compose as kompose } from '@storybook/react-komposer';
import { batchActions } from 'redux-batched-actions';
import { connect } from 'react-redux';
import { Tracker } from 'meteor/tracker';

import { pickC } from '/imports/api/helpers';
import { AuditLogsSubs } from '/imports/startup/client/subsmanagers';
import {
  setChangelogCollapsed,
  setLoadingLastLogs,
  setLastLogsLoaded,
  setLoadingAllLogs,
  setAllLogsLoaded,
  setChangelogDocumentData,
  setShowAll,
} from '/imports/client/store/actions/changelogActions';
import { lastLogsLimit } from '../../constants';
import Changelog from '../../components/Changelog';
import propTypes from './propTypes';

const onPropsChange = (props, onData) => {
  const { dispatch, documentId, collection } = props;

  dispatch(setChangelogDocumentData({
    documentId,
    collection,
  }));

  onData(null, props);
};

const onToggleCollapse = props => () => {
  const {
    dispatch,
    isChangelogCollapsed,
    isLastLogsLoaded,
    isAllLogsLoaded,
    documentId,
    collection,
  } = props;

  const toggleCollapse = () => (
    dispatch(setChangelogCollapsed(!isChangelogCollapsed))
  );

  if (!isChangelogCollapsed || isLastLogsLoaded || isAllLogsLoaded) {
    toggleCollapse();
    return;
  }

  dispatch(setLoadingLastLogs(true));

  const sub = AuditLogsSubs.subscribe('auditLogs', documentId, collection);

  Tracker.autorun((comp) => {
    if (sub.ready()) {
      toggleCollapse();

      dispatch(batchActions([
        setLoadingLastLogs(false),
        setLastLogsLoaded(true),
      ]));

      comp.stop();
    }
  });
};

const onViewAllClick = props => () => {
  const {
    dispatch, isAllLogsLoaded, documentId, collection,
  } = props;

  if (!isAllLogsLoaded) {
    dispatch(setLoadingAllLogs(true));

    const sub = AuditLogsSubs.subscribe('auditLogs', documentId, collection, lastLogsLimit, 0);

    Tracker.autorun((comp) => {
      if (sub.ready()) {
        dispatch(batchActions([
          setLoadingAllLogs(false),
          setAllLogsLoaded(true),
          setShowAll(true),
        ]));

        comp.stop();
      }
    });
  } else {
    dispatch(setShowAll(true));
  }
};

const ChangelogContainer = compose(
  connect(),

  shouldUpdate((props, nextProps) => props.documentId !== nextProps.documentId),

  kompose(onPropsChange),

  connect(state => pickC([
    'documentId',
    'collection',
    'isChangelogCollapsed',
    'isLastLogsLoaded',
    'isAllLogsLoaded',
  ])(state.changelog)),

  withHandlers({
    onToggleCollapse,
    onViewAllClick,
  }),

  mapProps(props => pickC([
    'documentId',
    'collection',
    'isChangelogCollapsed',
    'onToggleCollapse',
    'onViewAllClick',
  ])(props)),

  shouldUpdate((props, nextProps) =>
    (props.documentId !== nextProps.documentId)
    || (props.isChangelogCollapsed !== nextProps.isChangelogCollapsed)),
)(Changelog);

ChangelogContainer.propTypes = propTypes;

export default ChangelogContainer;
