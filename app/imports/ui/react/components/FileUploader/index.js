import React, { PropTypes } from 'react';

import Icon from '../Icon';

const FileUploader = ({ value, onChange }) => (
  <div className="btn btn-secondary btn-file">
    <Icon name="paperclip" />
    <input
      type="file"
      multiple="multiple"
      value={value}
      onChange={e => onChange(e.target.files)}
    />
  </div>
);

FileUploader.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default FileUploader;
