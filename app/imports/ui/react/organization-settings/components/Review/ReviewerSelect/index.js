import React, { PropTypes } from 'react';
import { compose, getContext, withProps, withState, withHandlers } from 'recompose';
import { FormGroup } from 'reactstrap';

import { getId, transsoc } from '/imports/api/helpers';
import { getFullNameOrEmail } from '/imports/api/users/helpers';
import SelectInput from '../../../../forms/components/SelectInput';

const SelectInputEnhanced = withState('value', 'setValue', '')(SelectInput);

const enhance = compose(
  getContext({
    changeField: PropTypes.func,
    getField: PropTypes.func,
  }),
  withProps(({ getField, fieldName, users = [] }) => ({
    selected: getField(fieldName) || '',
    items: users.map(transsoc({
      value: getId,
      text: getFullNameOrEmail,
    })),
  })),
  withHandlers({
    onSelect: ({ changeField, fieldName }) => (e, { value }, callback) => {
      if (value) changeField(fieldName, value, true, callback);
    },
  }),
);

const ReviewReviewerSelect = enhance(({ value, setValue, selected, items, onSelect }) => (
  <FormGroup>
    <label className="form-control-label">
      Reviewer
    </label>
    <SelectInputEnhanced
      placeholder="Select a reviewer"
      {...{ value, setValue, selected, items, onSelect }}
    />
  </FormGroup>
));

ReviewReviewerSelect.propTypes = {
  fieldName: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.object),
};

export default ReviewReviewerSelect;
