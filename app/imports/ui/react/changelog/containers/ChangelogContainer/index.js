import { compose, shouldUpdate } from 'recompose';
import { compose as kompose } from 'react-komposer';
import { batchActions } from 'redux-batched-actions';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import React from 'react';

import { setChangelogCollapsed } from '/client/redux/actions/changelogActions';
import {
  setLoadingLastLogs,
  setLastLogsLoaded,
  setLoadingAllLogs,
  setAllLogsLoaded,
  setChangelogDocumentData,
  setShowAll,
} from '/client/redux/actions/changelogActions';
import { lastLogsLimit } from '../../constants';
import Changelog from '../../components/Changelog';
import propTypes from './propTypes';
import { pickC } from '/imports/api/helpers';

const onPropsChange = (props, onData) => {
  const { dispatch, documentId, collection } = props;

  dispatch(setChangelogDocumentData({
    documentId,
    collection,
  }));

  onData(null, props);
};

const pickProps = pickC([
  'isChangelogCollapsed',
  'isLastLogsLoaded',
  'isAllLogsLoaded',
]);

const mapStateToProps = state => pickProps(state.changelog);

const _ChangelogContainer = Component => class extends React.Component {
  constructor(props) {
    super(props);

    this.subs = {};
    this.onToggleCollapse = this.onToggleCollapse.bind(this);
    this.onViewAllClick = this.onViewAllClick.bind(this);
  }

  componentWillUnmount() {
    Object.keys(this.subs).map(key => this.subs[key].stop());
  }

  onToggleCollapse() {
    const {
      dispatch,
      isChangelogCollapsed,
      isLastLogsLoaded,
      isAllLogsLoaded,
    } = this.props;

    const toggleCollapse = () => (
      dispatch(setChangelogCollapsed(!isChangelogCollapsed))
    );

    if (!isChangelogCollapsed || isLastLogsLoaded || isAllLogsLoaded) {
      toggleCollapse();
      return;
    }

    dispatch(setLoadingLastLogs(true));

    this._loadLastLogs({
      onReady: () => {
        toggleCollapse();
        dispatch(batchActions([
          setLoadingLastLogs(false),
          setLastLogsLoaded(true),
        ]));
      },
    });
  }

  onViewAllClick() {
    const { dispatch, isAllLogsLoaded } = this.props;

    if (!isAllLogsLoaded) {
      dispatch(setLoadingAllLogs(true));

      this._loadAllLogs({
        onReady: () => dispatch(batchActions([
          setLoadingAllLogs(false),
          setAllLogsLoaded(true),
          setShowAll(true),
        ])),
      });
    } else {
      dispatch(setShowAll(true));
    }
  }

  render() {
    return (
      <Component
        {..._.pick(this.props, ['documentId', 'collection', 'isChangelogCollapsed'])}
        onToggleCollapse={this.onToggleCollapse}
        onViewAllClick={this.onViewAllClick}
      />
    );
  }

  _loadLastLogs(options) {
    this._subscribe(
      'lastLogs',
      'auditLogs',
      this.props.documentId,
      this.props.collection,
      options
    );
  }

  _loadAllLogs(options) {
    this._subscribe(
      'allLogs',
      'auditLogs',
      this.props.documentId,
      this.props.collection,
      lastLogsLimit, // skip
      0, // limit
      options
    );
  }

  _subscribe(subKey, ...args) {
    this.subs[subKey] = Meteor.subscribe(...args);
  }
};

const ChangelogContainer = compose(
  connect(),
  kompose(onPropsChange),
  connect(mapStateToProps),
  _ChangelogContainer
)(Changelog);

ChangelogContainer.propTypes = propTypes;

export default ChangelogContainer;
