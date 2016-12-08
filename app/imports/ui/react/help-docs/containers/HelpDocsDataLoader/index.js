import {
  compose,
  lifecycle,
  mapProps,
  shouldUpdate,
  withHandlers,
} from 'recompose';
import { connect } from 'react-redux';
import { composeWithTracker, compose as kompose } from 'react-komposer';
import { batchActions } from 'redux-batched-actions';
import ReactDOM from 'react-dom';
import get from 'lodash.get';

import { MOBILE_BREAKPOINT } from '/imports/api/constants';
import { Files } from '/imports/share/collections/files';
import { setFiles } from '/client/redux/actions/collectionsActions';
import { setHelpSectionsData, setHelpDocsData } from '/client/redux/actions/helpDocsActions';
import { setShowCard } from '/client/redux/actions/mobileActions';
import { pickC, pickDeep } from '/imports/api/helpers';
import { goToDashboard } from '../../../helpers/routeHelpers';
import { createHelpSectionsData, createHelpDocsData } from '../../helpers';
import { redirectToHelpDoc, expandHelpSection } from './helpers';
import loadGlobalData from '../../loaders/loadGlobalData';
import loadMainData from '../../loaders/loadMainData';
import loadCardData from '../../loaders/loadCardData';
import HelpDocsLayout from '../../components/HelpDocsLayout';

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

  composeWithTracker((props, onData) => {
    props.dispatch(setFiles(Files.find().fetch())); // FIXME
    onData(null, {});
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
