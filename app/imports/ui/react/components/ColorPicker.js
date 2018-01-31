import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { GithubPicker } from 'react-color';
import styled from 'styled-components';
import { Popover, PopoverBody } from 'reactstrap';

import { withStateToggle } from '../helpers';

const StyledColorPickerIcon = styled.div`
  width: 33px;
  height: 33px;
  border-radius: 3px;
  outline: none !important;
  border: 1px solid #ccc;
  position: relative;
  overflow: hidden;
  display: block;
  transition: border-color 0.3s ease;
  cursor: pointer;
  background-color: #F06292;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: 5px solid white;
    transition: border-color 0.3s ease;
  }
    
  &:hover {
    border-color: #adadad;
    &:before { border-color: #e6e6e6; }
  }
`;

const StyledGithubPicker = styled(GithubPicker)`
  max-width: 368px;
  margin-left: 5px;
  min-width: 160px;
  padding: 5px 0 0 5px !important;
  margin: 2px 0 0;
  list-style: none;
  border: 1px solid rgba(0, 0, 0, .15) !important;
  border-radius: 4px !important;
  box-shadow: 0 6px 12px rgba(0, 0, 0, .175) !important;
  background-clip: padding-box !important;

  @media (max-width:767px) {
    max-width: 288px;
  }

  & [title^="#"] {
    width: 40px !important;
    height: 40px !important;
    margin: 0 5px 5px 0;

    @media (max-width:767px) {
      width: 30px !important;
      height: 30px !important;
    }

    &:hover {
      border: 1px solid rgba(0,0,0,0.5);
    }
  }

  & > span {
    &:hover {
      outline: none !important;
      box-shadow: none !important;
    }
  }

  & > span > div {
    width: auto !important;
    height: auto !important;

    &:hover {
      outline: none !important;
      box-shadow: none !important;
    }
  }
`;

const enhance = withStateToggle(false, 'isOpen', 'toggle');

const ColorPicker = ({
  isOpen,
  toggle,
  colors,
  width = 368,
  triangle = 'hide',
  ...props
}) => (
  <Fragment>
    <StyledColorPickerIcon id="colorpicker" onClick={toggle} />
    <Popover
      placement="bottom-start"
      target="colorpicker"
      {...{ isOpen, toggle }}
    >
      <PopoverBody>
        <StyledGithubPicker
          {...{
            colors,
            width,
            triangle,
            ...props,
          }}
        />
      </PopoverBody>
    </Popover>
  </Fragment>
);

ColorPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.number,
  triangle: PropTypes.string,
};

export default enhance(ColorPicker);
