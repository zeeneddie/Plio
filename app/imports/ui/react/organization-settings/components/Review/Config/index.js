import React from 'react';

import Form from '/imports/ui/react/forms/components/Form';
import ReviewFrequencySelect from '../FrequencySelect';
import ReviewAnnualDate from '../AnnualDate';
import ReviewReminders from '../Reminders';

const Config = (props) => (
  <div>
    <Form autosave onFormChange={props.onFrequencyChanged}>
      <ReviewFrequencySelect
        frequency={props.config.frequency}
        documentKey={props.documentKey}
      />
    </Form>

    <Form autosave onFormChange={props.onAnnualDateChanged}>
      <ReviewAnnualDate
        annualDate={props.config.annualDate}
        documentKey={props.documentKey}
      />
    </Form>

    <Form autosave onFormChange={props.onReminderChanged}>
      <ReviewReminders
        reminders={props.config.reminders}
        documentKey={props.documentKey}
      />
    </Form>
  </div>
);

export default Config;
