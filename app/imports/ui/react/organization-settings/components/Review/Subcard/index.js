import React, { PropTypes } from 'react';
import { CardBlock } from 'reactstrap';

import CardBlockCollapse from '/imports/ui/react/components/CardBlockCollapse';
import ReviewConfig from '../Config';

const ReviewSubcard = ({
  collapsed,
  setCollapsed,
  organization: { review },
  onAnnualDateChanged,
  onFrequencyChanged,
  onReminderChanged,
}) => (
  <CardBlockCollapse leftText="Review frequency">
    <CardBlock>
      <legend>Standards</legend>
      <ReviewConfig
        config={review.standards}
        documentKey="standards"
        onAnnualDateChanged={onAnnualDateChanged}
        onFrequencyChanged={onFrequencyChanged}
        onReminderChanged={onReminderChanged}
      />

      <legend>Risks</legend>
      <ReviewConfig
        config={review.risks}
        documentKey="risks"
        onAnnualDateChanged={onAnnualDateChanged}
        onFrequencyChanged={onFrequencyChanged}
        onReminderChanged={onReminderChanged}
      />
    </CardBlock>
  </CardBlockCollapse>
);

ReviewSubcard.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
  organization: PropTypes.object,
  onAnnualDateChanged: PropTypes.func,
  onFrequencyChanged: PropTypes.func,
  onReminderChanged: PropTypes.func,
};

export default ReviewSubcard;
