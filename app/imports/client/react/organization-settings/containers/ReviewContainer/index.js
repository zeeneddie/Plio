import { connect } from 'react-redux';
import {
  compose,
  withHandlers,
  withProps,
  withState,
  mapProps,
  branch,
  renderNothing,
} from 'recompose';
import property from 'lodash.property';

import { pickDeep, getId, identity } from '/imports/api/helpers';
import store from '/imports/client/store';
import ReviewSubcard from '../../components/Review/Subcard';
import initMainData from '../loaders/initMainData';
import loadUsersData from '../../../loaders/loadUsersData';
import {
  onFrequencyChanged,
  onAnnualDateChanged,
  onReminderChanged,
  onReviewerChanged,
} from './handlers';
import { composeWithTracker } from '../../../../util';

const enhance = compose(
  withProps({ store }),
  connect(),
  withState('collapsed', 'setCollapsed', true),
  composeWithTracker(initMainData),
  composeWithTracker(loadUsersData),
  connect(pickDeep(['organizations.organization', 'collections.usersByOrgIds'])),
  branch(
    property('organization'),
    identity,
    renderNothing,
  ),
  mapProps(({ usersByOrgIds, organization, ...props }) => ({
    ...props,
    organization,
    users: usersByOrgIds[getId(organization)],
  })),
  withHandlers({
    onFrequencyChanged,
    onAnnualDateChanged,
    onReminderChanged,
    onReviewerChanged,
  }),
);

export default enhance(ReviewSubcard);
