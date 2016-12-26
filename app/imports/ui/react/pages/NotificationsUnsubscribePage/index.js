import { compose, lifecycle, renderNothing, setPropTypes } from 'recompose';
import { toastr } from 'meteor/chrismbeckett:toastr';
import React, { PropTypes } from 'react';

const unsubscribe = ({
  call: (_, cb) => setTimeout(() => cb(null), 1500),
});

export default compose(
  setPropTypes({
    documentId: PropTypes.string.isRequired,
    documentType: PropTypes.string.isRequired,
  }),
  lifecycle({
    componentDidMount() {
      const { documentId, documentType } = this.props;
      console.log(documentId, documentType)
      unsubscribe.call({ documentId, documentType }, (err) =>
        !err && toastr.info("You've been unsubscribed from notifications of this document"));
    },
  }),
)(() => <div>Hello World</div>);
