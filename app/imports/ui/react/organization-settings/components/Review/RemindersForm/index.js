import PropTypes from 'prop-types';
import React from 'react';
import { compose, withProps } from 'recompose';

import Form from '/imports/ui/react/forms/components/Form';
import ReviewReminders from '../Reminders';
import { getFormProps } from '../helpers';

const enhance = compose(withProps(props => getFormProps(props)));

const ReviewRemindersForm = enhance(props => (
  <Form
    autosave
    initialFormData={props.initialFormData}
    onFormChange={props.onReminderChanged}
  >
    <ReviewReminders
      fieldName={props.fieldNames.reminders}
    />
  </Form>
));

ReviewRemindersForm.propTypes = {
  data: PropTypes.object,
  documentKey: PropTypes.string,
  onReminderChanged: PropTypes.func,
};

export default ReviewRemindersForm;
