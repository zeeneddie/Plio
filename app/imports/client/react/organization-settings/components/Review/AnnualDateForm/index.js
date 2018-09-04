import PropTypes from 'prop-types';
import React from 'react';
import { compose, withProps } from 'recompose';

import Form from '/imports/client/react/forms/components/Form';
import ReviewAnnualDate from '../AnnualDate';
import { getFormProps } from '../helpers';

const enhance = compose(withProps(props => getFormProps(props)));

const ReviewAnnualDateForm = enhance(props => (
  <Form
    autosave
    initialFormData={props.initialFormData}
    onFormChange={props.onAnnualDateChanged}
  >
    <ReviewAnnualDate
      fieldName={props.fieldNames.annualDate}
    />
  </Form>
));

ReviewAnnualDateForm.propTypes = {
  data: PropTypes.object,
  documentKey: PropTypes.string,
  onAnnualDateChanged: PropTypes.func,
};

export default ReviewAnnualDateForm;
