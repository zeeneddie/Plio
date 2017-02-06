import React, { PropTypes } from 'react';
import { withProps } from 'recompose';

import { getFormProps } from '../helpers';
import Form from '/imports/ui/react/forms/components/Form';
import ReviewReviewerSelect from '../ReviewerSelect';

const enhance = withProps(getFormProps);

const ReviewerForm = enhance(({ initialFormData, onReviewerChanged, fieldNames }) => (
  <Form
    {...{ initialFormData }}
    autosave
    onFormChange={onReviewerChanged}
  >
    <ReviewReviewerSelect fieldName={fieldNames.reviewer} />
  </Form>
));

ReviewerForm.propTypes = {
  data: PropTypes.object,
  documentKey: PropTypes.string,
  onFrequencyChanged: PropTypes.func,
};

export default ReviewerForm;
