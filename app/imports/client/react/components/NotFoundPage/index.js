import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

const NotFoundPage = props => (
  <div className="not-found col-xs-12 col-sm-12 col-md-12 col-lg-12">
    <div className="text-xs-center">
      <h1>You have no access to {props.subject} {props.subjectId}</h1>
      <a href={FlowRouter.path('hello')}>
        <i className="fa fa-arrow-left" />
        Return to my organization
      </a>
    </div>
  </div>
);

export default NotFoundPage;
