import { compose, withProps, lifecycle } from 'recompose';
import PropTypes from 'prop-types';
import React from 'react';

import { handleMethodResult } from '/imports/api/helpers';
import { unsubscribeFromDailyRecap } from '/imports/api/organizations/methods';

import renderUnsubscribePage from '../helpers/withState';

const enhancer = compose(
  lifecycle({
    componentDidMount() {
      const orgSerialNumber = parseInt(this.props.orgSerialNumber, 10);
      unsubscribeFromDailyRecap.call({ orgSerialNumber }, handleMethodResult(error =>
        this.props.setState({ error, loading: false })));
    },
  }),
  withProps({
    children: (
      <h3>You've successfully unsubscribed from the daily recap!</h3>
    ),
  }),
);

const DailyRecap = renderUnsubscribePage(enhancer);

DailyRecap.propTypes = {
  orgSerialNumber: PropTypes.string.isRequired,
};

export default DailyRecap;
