import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'reactstrap';

import { Icon } from '../../components';
import FileItem from './FileItem';

const StyledButton = styled(Button)`
  position: relative;
  overflow: hidden;
  input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    background: white;
    display: block;
    cursor: pointer;
  }
`;

const FileInput = ({
  files,
  onRemove,
  onChange,
  multi,
  upload,
}) => (
  <Fragment>
    {files.map(file => (
      <Fragment key={file.name + file._id}>
        <FileItem
          {...{ file }}
          onRemove={() => onRemove(file)}
        />
        {!upload && (
          file.name.split('.').pop().toLowerCase() === 'docx' ? (
            <p>File will be uploaded and rendered as HTML when you click on the Save button</p>
          ) : (
            <p>File will be uploaded when you click on the Save button</p>
          )
        )}
      </Fragment>
    ))}
    {(multi || !files.length) && (
      <StyledButton tag="span" color="primary">
        <Icon name="plus" />
        {' '}
        Add
        <input
          type="file"
          onChange={(event) => {
            onChange(event.currentTarget.files[0]);
          }}
        />
      </StyledButton>
    )}
  </Fragment>
);

FileInput.defaultProps = {
  upload: true,
};

FileInput.propTypes = {
  files: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  multi: PropTypes.bool,
  upload: PropTypes.bool,
};

export default FileInput;
