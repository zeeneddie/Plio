import React, { PropTypes } from 'react';
import { compose, withProps } from 'recompose';
import { _ } from 'meteor/underscore';

import ReviewFrequencyForm from '../FrequencyForm';
import ReviewAnnualDateForm from '../AnnualDateForm';
import ReviewRemindersForm from '../RemindersForm';

const enhance = compose(
  withProps(({ config }) => ({
    frequencyFormData: _.pick(config, 'frequency'),
    annualDateFormData: _.pick(config, 'annualDate'),
    remindersFormData: _.pick(config, 'reminders'),
  }))
);

const ReviewConfig = enhance((props) => (
  <div>
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
  onAnnualDateChanged: PropTypes.func,
  onFrequencyChanged: PropTypes.func,
  onReminderChanged: PropTypes.func,
};

export default ReviewConfig;
