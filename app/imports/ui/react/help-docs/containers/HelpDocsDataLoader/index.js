import {
  compose,
  lifecycle,
  mapProps,
  shouldUpdate,
  withHandlers,
} from 'recompose';
import { connect } from 'react-redux';
import { compose as kompose } from '@storybook/react-komposer';
import get from 'lodash.get';

import { pickC, pickDeep } from '/imports/api/helpers';
import { redirectToHelpDoc, expandHelpSection } from './helpers';
import { onHandleReturn } from './handlers';
import loadGlobalData from '../../loaders/loadGlobalData';
import loadMainData from '../../loaders/loadMainData';
import loadCardData from '../../loaders/loadCardData';
import initHelpSectionsData from '../../loaders/initHelpSectionsData';
import initFiles from '../../loaders/initFiles';
import HelpDocsLayout from '../../components/HelpDocsLayout';
import { composeWithTracker } from '../../../../../client/util';

export default compose(
  connect(),

  composeWithTracker(loadGlobalData),

  composeWithTracker(loadMainData),

  connect(pickDeep([
    'collections.helpDocs',
    'collections.helpSections',
  ])),

  kompose(initHelpSectionsData),

  connect(pickDeep(['global.urlItemId'])),

  composeWithTracker(loadCardData, {
    propsToWatch: ['urlItemId'],
  }),

  composeWithTracker(initFiles, {
    propsToWatch: ['helpDocs'],
  }),

  connect(pickDeep([
    'global.searchText',
    'global.urlItemId',
    'collections.helpDocs',
    'helpDocs.helpDocsFiltered',
  ])),

  lifecycle({
    componentWillMount() {
      redirectToHelpDoc(this.props);
    },
    componentDidMount() {
      expandHelpSection(this.props);
    },
    componentWillReceiveProps(nextProps) {
      redirectToHelpDoc(nextProps);
    },
    componentWillUpdate(nextProps) {
      expandHelpSection(nextProps);
    },
  }),

  connect(pickDeep(['window.width', 'mobile.showCard'])),

  withHandlers({
    onHandleReturn,
  }),

  connect(state => ({ isLoading: get(state, 'global.dataLoading') })),

  mapProps(props => pickC([
    'dispatch',
    'isLoading',
    'onHandleReturn',
  ])(props)),

  shouldUpdate((props, nextProps) => props.isLoading !== nextProps.isLoading),
)(HelpDocsLayout);
