import { connect } from 'react-redux';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { composeWithTracker } from 'react-komposer';

import store from '/imports/client/store';
import ReviewSubcard from '../../components/Review/Subcard';
import initMainData from '../loaders/initMainData';
import { pickDeep } from '/imports/api/helpers';
import {
  onFrequencyChanged,
  onAnnualDateChanged,
  onReminderChanged,
} from './handlers';

const enhance = compose(
  withProps({ store }),
  withState('collapsed', 'setCollapsed', true),
  composeWithTracker(initMainData),
  connect(pickDeep(['organizations.organization'])),
  withHandlers({
    onFrequencyChanged,
    onAnnualDateChanged,
    onReminderChanged,
  }),
);

export default enhance(ReviewSubcard);
