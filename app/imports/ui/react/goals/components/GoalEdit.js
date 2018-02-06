// import PropTypes from 'prop-types';
import React from 'react';

// import GoalForm from './GoalForm';
import { FormField, FormInput } from '../../components';

const GoalEdit = ({ title, onChangeTitle }) => (
  <FormField>
    Key goal name
    <FormInput
      placeholder="Key goal name"
      value={title}
      onChange={onChangeTitle}
      debounceTimeout={700}
    />
  </FormField>
  // <GoalForm {...props} />
);

GoalEdit.propTypes = {};

export default GoalEdit;
