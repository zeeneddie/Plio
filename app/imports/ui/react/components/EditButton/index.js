import React from 'react';

import propTypes from './propTypes';

const EditButton = ({ onClick, title = 'Edit' }) => (
  <a className="btn btn-primary" onClick={onClick}>
    <i className="fa fa-pencil"></i>
    {title}
  </a>
);

EditButton.propTypes = propTypes;

export default EditButton;
