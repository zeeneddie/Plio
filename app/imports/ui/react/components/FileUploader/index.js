import React, { PropTypes } from 'react';

import Button from '../Button';
import Icon from '../Icon';

const FileUploader = ({ value, onChange }) => (
  <Button type="secondary" className="btn-file">
    <Icon name="paperclip" size="2" />
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
