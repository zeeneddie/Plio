import React from 'react';

const DiscussionHeader = ({ backUrl }) => (
  <div className="card-block card-heading chat-heading">
    <div className="discussions-hd-top">
      <div className="card-heading-buttons pull-xs-left">
        <a className="btn btn-secondary" href={backUrl}>
          <i className="fa fa-angle-left fa-lg margin-right" />
          Back
        </a>
      </div>

      <h3 className="card-title text-xs-center">
        Discussion
      </h3>
    </div>
  </div>
);

export default DiscussionHeader;
