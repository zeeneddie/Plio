import PropTypes from 'prop-types';
import React from 'react';
import { compose, withProps } from 'recompose';
import property from 'lodash.property';

import { pickC, transsoc } from '/imports/api/helpers';
import ReviewFrequencyForm from '../FrequencyForm';
import ReviewAnnualDateForm from '../AnnualDateForm';
import ReviewRemindersForm from '../RemindersForm';
import ReviewReviewerForm from '../ReviewerForm';

const getData = key => compose(pickC([key]), property('config'));

const enhance = withProps(transsoc({
  reviewerFormData: getData('reviewerId'),
  frequencyFormData: getData('frequency'),
  annualDateFormData: getData('annualDate'),
  remindersFormData: getData('reminders'),
}));

const ReviewConfig = enhance(props => (
  <div>
    <ReviewReviewerForm
      onReviewerChanged={props.onReviewerChanged}
      data={props.reviewerFormData}
      documentKey={props.documentKey}
      users={props.users}
    />

    <ReviewFrequencyForm
      onFrequencyChanged={props.onFrequencyChanged}
      data={props.frequencyFormData}
      documentKey={props.documentKey}
    />

    <ReviewAnnualDateForm
      onAnnualDateChanged={props.onAnnualDateChanged}
      data={props.annualDateFormData}
      documentKey={props.documentKey}
    />

    <ReviewRemindersForm
      onReminderChanged={props.onReminderChanged}
      data={props.remindersFormData}
      documentKey={props.documentKey}
    />
  </div>
));

ReviewConfig.propTypes = {
  config: PropTypes.object,
  documentKey: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.object),
  onReviewerChanged: PropTypes.func,
  onAnnualDateChanged: PropTypes.func,
  onFrequencyChanged: PropTypes.func,
  onReminderChanged: PropTypes.func,
};

export default ReviewConfig;
