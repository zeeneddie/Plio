import PropTypes from 'prop-types';
import React from 'react';
import { Input } from 'reactstrap';

import Button from '../Buttons/Button';
import Icon from '../Icons/Icon';

const FileUploader = ({ value, onChange }) => (
  <Button color="secondary file" component="div">
    <Icon name="paperclip" />
    <Input
      multiple
      type="file"
      onChange={e => onChange(e.target.files)}
      {...{ value }}
    />
  </Button>
);

FileUploader.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default FileUploader;
