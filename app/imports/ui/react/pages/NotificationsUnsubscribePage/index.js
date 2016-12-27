import { compose, lifecycle, withState, flattenProp } from 'recompose';
import React, { PropTypes } from 'react';

import { handleMethodResult } from '/imports/api/helpers';
import { getPath } from '/imports/ui/utils/router/paths';
import { unsubscribe } from '/imports/api/notifications/methods';

const enhance = compose(
  withState('state', 'setState', { loading: true, error: null }),
  lifecycle({
    componentDidMount() {
      const { documentId, documentType } = this.props;
      unsubscribe.call({ documentId, documentType }, handleMethodResult((error) =>
        this.props.setState({ error, loading: false })
      ));
    },
  }),
  flattenProp('state'),
);

const NotificationsUnsubscribePage = enhance(({ loading, error }) => {
  if (loading) return (<span>Unsubscribing...</span>);

  let text = "You've been successfully unsubscribed from notifications of this document!";

  if (error) text = 'Ooops... something went wrong!';

  return (
    <div>
      <h3>{text}</h3>
      <a href={getPath('dashboardPage')()}>Open the dashboard</a>
    </div>
  );
});

NotificationsUnsubscribePage.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
};

export default NotificationsUnsubscribePage;
