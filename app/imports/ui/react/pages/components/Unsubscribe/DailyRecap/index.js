import { compose, withProps, lifecycle } from 'recompose';
import React, { PropTypes } from 'react';

import { handleMethodResult } from '/imports/api/helpers';
import { unsubscribeFromDailyRecap } from '/imports/api/organizations/methods';

import renderUnsubscribePage from '../helpers/withState';

const enhancer = compose(
  lifecycle({
    componentDidMount() {
      const { organizationId } = this.props;
      unsubscribeFromDailyRecap.call({ organizationId }, handleMethodResult((error) =>
        this.props.setState({ error, loading: false })
      ));
    },
  }),
  withProps({
    children: (
      <h3>You've successfully unsubscribed from daily recap!</h3>
    ),
  }),
);

const DailyRecap = renderUnsubscribePage(enhancer);

DailyRecap.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default DailyRecap;
