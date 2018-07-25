import PropTypes from 'prop-types';
import React from 'react';
import { compose, getContext, withProps, withHandlers } from 'recompose';
import { FormGroup } from 'reactstrap';

import { getId, transsoc } from '/imports/api/helpers';
import { getFullNameOrEmail } from '/imports/api/users/helpers';
import { SelectInput } from '../../../../forms/components';

const enhance = compose(
  getContext({
    changeField: PropTypes.func,
    getField: PropTypes.func,
  }),
  withProps(({ getField, fieldName, users = [] }) => ({
    selected: getField(fieldName) || '',
    items: users.map(transsoc({
      value: getId,
      label: getFullNameOrEmail,
    })),
  })),
  withHandlers({
    onSelect: ({ changeField, fieldName }) => ({ value }, callback) => {
      if (value) changeField(fieldName, value, true, callback);
    },
  }),
);

const ReviewReviewerSelect = enhance(({ selected, items, onSelect }) => (
  <FormGroup>
    <label className="form-control-label">
      Reviewer
    </label>
    <SelectInput
      value={selected}
      options={items}
      onChange={onSelect}
      placeholder="Select a reviewer..."
    />
  </FormGroup>
));

ReviewReviewerSelect.propTypes = {
  fieldName: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.object),
};

export default ReviewReviewerSelect;
