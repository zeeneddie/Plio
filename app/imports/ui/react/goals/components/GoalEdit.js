// import PropTypes from 'prop-types';
import React from 'react';

import GoalForm from './GoalForm';

const GoalEdit = props => (
  <GoalForm isEditMode {...props} />
);

GoalEdit.propTypes = {};

export default GoalEdit;
