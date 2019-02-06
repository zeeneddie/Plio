import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, ButtonGroup } from 'reactstrap';

import { Icon } from '../../components';

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

const FileInput = ({ value, onRemove, ...rest }) => {
  if (value) {
    return (
      <ButtonGroup>
        <Button>{value.name}</Button>
        <Button className="btn-icon">
          <Icon name="times-circle" onClick={onRemove} />
        </Button>
      </ButtonGroup>
    );
  }
  return (
    <StyledButton tag="span" color="primary">
      <Icon name="plus" /> Add
      <input {...rest} type="file" />
    </StyledButton>
  );
};

FileInput.propTypes = {
  onRemove: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default FileInput;
