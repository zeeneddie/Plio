import { Meteor } from 'meteor/meteor';
import {
  compose,
  lifecycle,
  mapProps,
  shouldUpdate,
  withHandlers,
} from 'recompose';
import { connect } from 'react-redux';
import { composeWithTracker, compose as kompose } from 'react-komposer';
import ReactDOM from 'react-dom';
import get from 'lodash.get';

import { MOBILE_BREAKPOINT } from '/imports/api/constants';
import { Files } from '/imports/share/collections/files';
import { HelpDocs } from '/imports/share/collections/help-docs';
import { setInitializing } from '/client/redux/actions/globalActions';
import { setHelpSectionsData } from '/client/redux/actions/helpDocsActions';
import { setShowCard } from '/client/redux/actions/mobileActions';
import { pickC, pickDeep } from '/imports/api/helpers';
import { goToDashboard } from '../../../helpers/routeHelpers';
import { createHelpSectionsData } from '../../helpers';
import { redirectToHelpDoc, expandHelpSection } from './helpers';
import loadGlobalData from '../../loaders/loadGlobalData';
import loadMainData from '../../loaders/loadMainData';
import loadCardData from '../../loaders/loadCardData';
import setupObserver from '../../../helpers/setupObserver';
import HelpDocsLayout from '../../components/HelpDocsLayout';

const observeHelpDocs = (dispatch) => setupObserver(HelpDocs.find(), dispatch);

const observeFiles = (dispatch) => setupObserver(Files.find(), dispatch);

const initHelpSectionsData = ({ helpDocs, helpSections, dispatch }, onData) => {
  const helpSectionsData = createHelpSectionsData(helpSections, helpDocs);
  dispatch(setHelpSectionsData(helpSectionsData));

  onData(null, {});
};

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

  composeWithTracker(loadCardData, null, null, {
    shouldResubscribe: (props, nextProps) =>
      props.urlItemId !== nextProps.urlItemId,
  }),

  connect(pickDeep([
    'global.urlItemId',
    'collections.helpDocs',
    'helpDocs.helpSectionsData',
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

  connect(pickDeep([
    'global.initializing',
    'global.isLayoutReady',
    'global.isCardReady',
  ])),

  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { initializing, isLayoutReady, isCardReady, dispatch } = nextProps;

      if (initializing && isLayoutReady && isCardReady) {
        Meteor.defer(() => {
          this.observers = [
            observeHelpDocs(dispatch),
            observeFiles(dispatch),
          ];
        });

        this.props.dispatch(setInitializing(false));
      }
    },
    componentWillUnmount() {
      this.observers.forEach(handle => handle.stop());
    },
  }),

  connect(pickDeep(['window.width', 'mobile.showCard'])),

  withHandlers({
    onHandleReturn: (props) => () => {
      if (props.width <= MOBILE_BREAKPOINT && props.showCard) {
        return props.dispatch(setShowCard(false));
      }

      // remove when dashboard is written in react
      ReactDOM.unmountComponentAtNode(document.getElementById('app'));

      return goToDashboard();
    },
  }),

  connect(state => ({ isLoading: get(state, 'global.dataLoading') })),

  mapProps(props => pickC([
    'dispatch',
    'isLoading',
    'onHandleReturn',
  ])(props)),

  shouldUpdate((props, nextProps) => props.isLoading !== nextProps.isLoading),
)(HelpDocsLayout);
