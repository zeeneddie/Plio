import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, Row, Col } from 'reactstrap';

import CardBlockCollapse from '/imports/client/react/components/CardBlockCollapse';
import ReviewConfig from '../Config';

const ReviewSubcard = ({
  onAnnualDateChanged,
  onFrequencyChanged,
  onReminderChanged,
  onReviewerChanged,
  users = [],
  organization: { review = {} } = {},
}) => {
  const getProps = (documentKey, config) => ({
    config,
    documentKey,
    users,
    onAnnualDateChanged,
    onFrequencyChanged,
    onReminderChanged,
    onReviewerChanged,
  });

  return (
    <CardBlockCollapse leftText="Review frequency">
      <CardBody className="card-block">
        <legend>Standards</legend>
        <ReviewConfig {...getProps('standards', review.standards)} />
        <Row><Col>&nbsp;</Col></Row>
        <legend>Risks</legend>
        <ReviewConfig {...getProps('risks', review.risks)} />
      </CardBody>
    </CardBlockCollapse>
  );
};

ReviewSubcard.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
  organization: PropTypes.object,
  users: PropTypes.arrayOf(PropTypes.object),
  onAnnualDateChanged: PropTypes.func,
  onFrequencyChanged: PropTypes.func,
  onReminderChanged: PropTypes.func,
  onReviewerChanged: PropTypes.func,
};

export default ReviewSubcard;
