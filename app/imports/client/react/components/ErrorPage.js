import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Col } from 'reactstrap';

import { Icon } from './Icons';

const ErrorPage = ({ error }) => (
  <Col className="not-found text-xs-center">
    <h1>{error}</h1>
    <a href={FlowRouter.path('hello')}>
      <Icon name="arrow-left" margin="right" />
      Return to my organization
    </a>
  </Col>
);

ErrorPage.propTypes = {
  error: PropTypes.string,
};

export default ErrorPage;
