import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { GithubPicker } from 'react-color';
import styled, { css } from 'styled-components';
import { Popover, PopoverBody } from 'reactstrap';
import { StyledMixins } from 'plio-util';
import { defaultTo, compose, prop, identity } from 'ramda';
import { withHandlers, branch } from 'recompose';


import withStateToggle from '../helpers/withStateToggle';

const DESKTOP_SWATCH_SIZE = '40px';
const MOBILE_SWATCH_SIZE = '30px';

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
  background-color: ${({ value }) => value};

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

  ${StyledMixins.media.mobile`
    max-width: 288px;
  `};

  ${({ value }) => css`
    & [title="${defaultTo('', value).toUpperCase()}"] {
      &::after {
        margin: 0;
        line-height: ${DESKTOP_SWATCH_SIZE};
        display: block;
        text-align: center;

        ${StyledMixins.media.mobile`
          line-height: ${MOBILE_SWATCH_SIZE};
        `}
      }

      &:after {
        font-family: FontAwesome;
        -webkit-font-smoothing: antialiased;
        content: "\f00c";
        margin-right: 1px;
        margin-left: 1px;
        color: #fff;
      }
    }
  `}

  & [title^="#"] {
    width: ${DESKTOP_SWATCH_SIZE} !important;
    height: ${DESKTOP_SWATCH_SIZE} !important;
    margin: 0 5px 5px 0;

    ${StyledMixins.media.mobile`
      width: ${MOBILE_SWATCH_SIZE} !important;
      height: ${MOBILE_SWATCH_SIZE} !important;
    `}

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

const enhance = compose(
  branch(
    prop('toggle'),
    identity,
    withStateToggle(false, 'isOpen', 'toggle'),
  ),
  withHandlers({
    onChange: ({ onChange, toggle }) => (...args) => {
      toggle();
      return onChange(...args);
    },
  }),
);

const ColorPicker = ({
  isOpen,
  toggle,
  colors,
  width = 368,
  triangle = 'hide',
  value,
  onChange,
  ...props
}) => (
  <Fragment>
    <StyledColorPickerIcon
      id="colorpicker"
      onClick={toggle}
      {...{ value }}
    />
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
            value,
            onChange,
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
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default enhance(ColorPicker);
