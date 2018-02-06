// import PropTypes from 'prop-types';
import React from 'react';

import GoalForm from './GoalForm';

const GoalEdit = props => (
  <GoalForm debounceTimeout={800} {...props} />
);

GoalEdit.propTypes = {};

export default GoalEdit;
