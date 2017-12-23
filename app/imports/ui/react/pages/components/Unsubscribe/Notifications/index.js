import { compose, withProps, lifecycle } from 'recompose';
import PropTypes from 'prop-types';
import React from 'react';

import { handleMethodResult } from '/imports/api/helpers';
import { unsubscribe } from '/imports/api/notifications/methods';

import renderUnsubscribePage from '../helpers/withState';

const enhancer = compose(
  lifecycle({
    componentDidMount() {
      const { documentId, documentType } = this.props;
      unsubscribe.call({ documentId, documentType }, handleMethodResult(error =>
        this.props.setState({ error, loading: false })));
    },
  }),
  withProps({
    children: (
      <h3>You've successfully unsubscribed from notifications of this document!</h3>
    ),
  }),
);

const Notifications = renderUnsubscribePage(enhancer);


Notifications.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
};

export default Notifications;
