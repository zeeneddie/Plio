import React, { PropTypes } from 'react';
import { CardBlock } from 'reactstrap';

import CardBlockCollapse from '/imports/ui/react/components/CardBlockCollapse';
import ReviewConfig from '../Config';

const ReviewSubcard = ({
  onAnnualDateChanged,
  onFrequencyChanged,
  onReminderChanged,
  onReviewerChanged,
  users = [],
  organization: { review } = {},
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
      <CardBlock>
        <legend>Standards</legend>
        <ReviewConfig {...getProps('standards', review.standards)} />

        <legend>Risks</legend>
        <ReviewConfig {...getProps('risks', review.risks)} />
      </CardBlock>
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
