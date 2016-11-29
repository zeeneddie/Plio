import React, { PropTypes } from 'react';

import Button from '../Buttons/Button';
import Icon from '../Icon';

const FileUploader = ({ value, onChange }) => (
  <Button type="secondary" className="btn-file">
    <Icon names="paperclip" size="3" />
    <input
      type="file"
      multiple="multiple"
      value={value}
      onChange={e => onChange(e.target.files)}
    />
  </Button>
);

FileUploader.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default FileUploader;
