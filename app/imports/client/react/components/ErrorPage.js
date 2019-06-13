import PropTypes from 'prop-types';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Col } from 'reactstrap';

import Icon from './Icons/Icon';

const ErrorPage = ({ error }) => (
  <div className="content no-flex scroll">
    <div className="container">
      <div className="row">
        <div className="content-cards col-sm-12">
          <Col className="not-found text-xs-center">
            <div className="text-xs-center">
              <h1>{error}</h1>
              <a href={FlowRouter.path('hello')}>
                <Icon name="arrow-left" margin="right" />
                Return to my organization
              </a>
            </div>
          </Col>
        </div>
      </div>
    </div>
  </div>
);

ErrorPage.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorPage;
