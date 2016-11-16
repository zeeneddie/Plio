import React from 'react';

import propTypes from './propTypes';

const AddButton = ({ onClick }) => (
  <button
    className="btn btn-primary"
    onClick={onClick}
  >
    <i className="fa fa-plus"></i>
    <span>Add</span>
  </button>
);

AddButton.propTypes = propTypes;

export default AddButton;
