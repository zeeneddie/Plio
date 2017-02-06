import { connect } from 'react-redux';
import { compose, withHandlers, withProps, withState, mapProps } from 'recompose';
import { composeWithTracker } from 'react-komposer';

import store from '/imports/client/store';
import ReviewSubcard from '../../components/Review/Subcard';
import initMainData from '../loaders/initMainData';
import loadUsersData from '../../../loaders/loadUsersData';
import { pickDeep, getId } from '/imports/api/helpers';
import {
  onFrequencyChanged,
  onAnnualDateChanged,
  onReminderChanged,
  onReviewerChanged,
} from './handlers';

const enhance = compose(
  withProps({ store }),
  connect(),
  withState('collapsed', 'setCollapsed', true),
  composeWithTracker(initMainData),
  composeWithTracker(loadUsersData),
  connect(pickDeep(['organizations.organization', 'collections.usersByOrgIds'])),
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
