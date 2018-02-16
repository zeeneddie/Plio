import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import styled, { css } from 'styled-components';
import { prop } from 'ramda';
import { compose, withState, withHandlers } from 'recompose';
// import 'react-select/dist/react-select.css';

const SelectWrapper = styled.div`
  .Select {
    &.is-focused:not(.is-open) > .Select-control {
      border-color: #ccc;
      box-shadow: none;
    }
    &.is-open > .Select-control {
      border-color: #66afe9;
      box-shadow: none;
    }
    .Select-arrow-zone {
      width: 35px;
      background-image: linear-gradient(to bottom, white 0%, #e6e6e6 100%);
      border-radius: 0 4px 4px 0;
      border-left: 1px solid #e6e6e6;
      padding-left: 5px;
      &:hover > .Select-arrow {
        border-top-color: #000;
      }
    }
    .Select-arrow {
      border-color: #000 transparent transparent;
      border-width: 6px 6px 2.5px;
    }
    &.is-open > .Select-control .Select-arrow {
      border-color: transparent transparent #000;
      border-width: 2.5px 6px 6px;
    }
  }
  .Select-option,
  .Select-create-option-placeholder {
    &.is-selected {
      background-color: #0275d8;
      color: #fff;
    }
    &:not(.is-selected):hover {
      background-color: #f8f9fa;
    }
  }
  ${({ type }) => type === 'creatable' ? css`
    .Select-menu-outer {
      max-height: none;
      &:after {
        content: 'Start typing...';
        display: block;
        padding: 8px 10px;
        border-top: 1px solid #ccc;
        font-weight: 1000;
        color: #373a3c;
      }
    }
    .Select-create-option-placeholder {
      position: absolute;
      bottom: 0;
      width: 100%;
      font-weight: 1000;
      background-color: #fff;
      color: #373a3c;
      height: 38px;
      border-radius: 0 0 4px 4px;
      &.is-focused {
        background-color: #f8f9fa;
      }
    }
  ` : ''}
`;

const TextCreatorWrapper = styled.span`
  position: relative;
  top: -5px;
  .btn {
    margin-right: 8px;
  }
`;

const enhance = compose(
  withState('value', 'setValue', prop('value')),
  withHandlers({
    onChange: ({ setValue, onChange }) => (option) => {
      setValue(option.value);
      if (onChange) {
        onChange(option);
      }
    },
    onNewOptionClick: ({ setValue, onNewOptionClick }) => (createdTag) => {
      if (onNewOptionClick) {
        onNewOptionClick(createdTag, (newOption) => {
          setValue(newOption.value);
        });
      }
    },
    getSelectComponent: ({ type }) => () => {
      switch (type) {
        case 'creatable': {
          return Select.Creatable;
        }
        case 'async':
          return Select.Async;
        case 'simple':
        default:
          return Select;
      }
    },
    promptTextCreator: ({ promptTextCreator }) => label => (
      <TextCreatorWrapper>
        <a className="btn btn-add btn-secondary btn-sm">
          <i className="fa fa-plus" />
        </a>
        {promptTextCreator(label)}
      </TextCreatorWrapper>
    ),
  }),
);

const SelectField = ({ getSelectComponent, type, ...props }) => {
  const SelectComponent = getSelectComponent();

  return (
    <SelectWrapper type={type}>
      <SelectComponent
        {...props}
        noResultsText="There are no available items..."
      />
    </SelectWrapper>
  );
};

SelectField.defaultProps = {
  clearable: false,
};

SelectField.propTypes = {
  getSelectComponent: PropTypes.func,
  clearable: PropTypes.bool,
  type: PropTypes.string,
};

export default enhance(SelectField);
