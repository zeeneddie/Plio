import React, { PropTypes } from 'react';

import Subcard from '../../../../components/Subcard';
import ReviewConfig from '../Config';

const ReviewSubcard = ({
  collapsed,
  setCollapsed,
  organization: { review },
  onAnnualDateChanged,
  onFrequencyChanged,
  onReminderChanged,
}) => (
  <Subcard collapsed={collapsed} setCollapsed={setCollapsed}>
    <Subcard.Title>
      <Subcard.TitleItem pull="left">
        Review
      </Subcard.TitleItem>
    </Subcard.Title>

    <Subcard.Content>
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
    </Subcard.Content>
  </Subcard>
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
