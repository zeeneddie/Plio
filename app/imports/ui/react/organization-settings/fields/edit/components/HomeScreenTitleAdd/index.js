import PropTypes from 'prop-types';
import React from 'react';
import { compose, withHandlers, getContext } from 'recompose';

import DropdownItemAdd from '../../../../../components/DropdownItemAdd';
import { createWorkspaceTitleValue } from '../../../../helpers';
import swal from '/imports/ui/utils/swal';

const enhance = compose(
  getContext({ onSelect: PropTypes.func }),
  withHandlers({
    showAlert: ({ id, value, onSelect }) => (e) => {
      if (!value) return;

      e.preventDefault();
      e.stopPropagation();

      const addNewItem = () => {
        const newItem = { text: value, value: createWorkspaceTitleValue(id, value) };
        const showSuccessAlert = () =>
          swal.success('Added!', `Title "${value}" was added successfully.`);

        onSelect(null, newItem, err => !err && showSuccessAlert());
      };

      swal({
        text: `New title "${value}" will replace the current one.`,
        confirmButtonText: 'Add',
      }, addNewItem);
    },
  }),
);

const HomeScreenTitleAdd = enhance(({ value, showAlert }) => (
  <DropdownItemAdd tag="span" onMouseDown={showAlert}>
    {!!value && `Add "${value}" title`}
  </DropdownItemAdd>
));

HomeScreenTitleAdd.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default HomeScreenTitleAdd;
