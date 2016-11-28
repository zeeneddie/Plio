import {
  compose,
  withHandlers,
  withProps,
} from 'recompose';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import get from 'lodash.get';

import { Helps } from '/imports/share/collections/helps';
import { Organizations } from '/imports/share/collections/organizations';
import {
  DocumentLayoutSubs,
  DocumentCardSubs,
} from '/imports/startup/client/subsmanagers';
import {
  setUserId,
  setUrlItemId,
  setDataLoading,
} from '/client/redux/actions/globalActions';
import {
  setOrg,
  setOrgId,
  setOrgSerialNumber,
} from '/client/redux/actions/organizationsActions';
import { setHelps } from '/client/redux/actions/collectionsActions';
import { setIsHelpCardReady } from '/client/redux/actions/helpsActions';
import { getId, pickDeep } from '/imports/api/helpers';
import { goToDashboard } from '../../../helpers/routeHelpers';
import HelpsLayout from '../../components/HelpsLayout';

const loadGlobalData = ({ dispatch }, onData) => {
  const userId = Meteor.userId();
  const orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'), 10);
  const urlItemId = FlowRouter.getParam('helpId');

  dispatch(batchActions([
    setUserId(userId),
    setOrgSerialNumber(orgSerialNumber),
    setUrlItemId(urlItemId),
  ]));

  onData(null, { orgSerialNumber });
};

const loadLayoutData = ({ orgSerialNumber, dispatch }, onData) => {
  const sub = DocumentLayoutSubs.subscribe('helpsLayout', orgSerialNumber);

  if (sub.ready()) {
    const organization = Organizations.findOne({ serialNumber: orgSerialNumber });
    const organizationId = getId(organization);
    const helps = Helps.find({ organizationId }).fetch();

    const actions = [
      setOrg(organization),
      setOrgId(organizationId),
      setHelps(helps),
      setDataLoading(false),
    ];

    dispatch(batchActions(actions));
  } else {
    dispatch(setDataLoading(true));
  }

  onData(null, {});
};

const loadCardData = ({
  help,
  dispatch,
}, onData) => {
  let sub;
  let isCardReady = true;

  if (help) {
    sub = DocumentCardSubs.subscribe('helpCard', { helpId: getId(help) });
    isCardReady = sub.ready();
  }

  dispatch(setIsHelpCardReady(isCardReady));

  onData(null, {});
};

export default compose(
  connect(),

  composeWithTracker(loadGlobalData),

  composeWithTracker(loadLayoutData, null, null, {
    shouldResubscribe: (props, nextProps) =>
      props.orgSerialNumber !== nextProps.orgSerialNumber,
  }),

  connect(pickDeep(['global.urlItemId'])),

  withProps(props => ({ help: Helps.findOne({ _id: props.urlItemId }) })),

  composeWithTracker(loadCardData, null, null, {
    shouldResubscribe: (props, nextProps) =>
      typeof props.help !== typeof nextProps.help,
  }),

  connect(state => ({ isLoading: get(state, 'global.dataLoading') })),

  withHandlers({
    onHandleReturn: (props) => () => {
      // remove when dashboard is written in react
      ReactDOM.unmountComponentAtNode(document.getElementById('app'));

      return goToDashboard();
    },
  }),
)(HelpsLayout);
