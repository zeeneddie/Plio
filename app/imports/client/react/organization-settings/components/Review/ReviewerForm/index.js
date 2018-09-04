import PropTypes from 'prop-types';
import React from 'react';
import { withProps } from 'recompose';

import { getFormProps } from '../helpers';
import Form from '/imports/client/react/forms/components/Form';
import ReviewReviewerSelect from '../ReviewerSelect';

const enhance = withProps(getFormProps);

const ReviewerForm = enhance(({
  initialFormData, onReviewerChanged, fieldNames, users,
}) => (
  <Form
    {...{ initialFormData }}
    autosave
    onFormChange={onReviewerChanged}
  >
    <ReviewReviewerSelect {...{ users }} fieldName={fieldNames.reviewerId} />
  </Form>
));

ReviewerForm.propTypes = {
  data: PropTypes.object,
  documentKey: PropTypes.string,
  onFrequencyChanged: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.object),
};

export default ReviewerForm;
