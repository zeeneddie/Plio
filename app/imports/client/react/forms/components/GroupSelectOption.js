import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import { merge } from 'ramda';
import cx from 'classnames';

import { Styles } from '../../../../api/constants';
import { Icon } from '../../components';

const TitleOption = styled.div`
  &.Select-option {
    font-family: ${Styles.font.family.segoe.semibold};
    background-color: ${Styles.background.color.lightGrey};
    color: ${Styles.color.black};
    cursor: default;
    clear: both;
    &:hover {
      background-color: ${Styles.background.color.lightGrey} !important;
    }
  }
`;

const InfoOption = styled.div`
  &.Select-option {
    color: ${Styles.color.muted};
    cursor: default;
    float: right;
    font-size: 1rem;
    &:hover {
      background-color: #fff !important;
    }
  }
`;

const CreatableOption = styled.div`
  &.Select-option {
    cursor: default;
    clear: both;
    border-top: 1px solid ${Styles.border.color.grey};
    font-family: ${Styles.font.family.segoe.semibold};
    &:hover {
      background-color: #fff !important;
    }
  }
  .btn: {
    margin: 0 7px 0 0;
  }
`;

const Option = styled.div`
  &.Select-option {
    position: relative;
  }
`;

const StyledBtn = styled(Button)`
  &.btn {
    margin: 0 7px 0 0;
  }
`;

class GroupSelectOption extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    option: PropTypes.object.isRequired,
    isFocused: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    inputValue: PropTypes.string,
  }

  onMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }

  onMouseEnter = (event) => {
    this.props.onFocus(this.props.option, event);
  }

  onMouseMove = (event) => {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  }

  onNewOptionClick = (event) => {
    const {
      option: { onClick, type },
      inputValue,
      onSelect,
    } = this.props;
    onClick({
      value: inputValue,
      label: inputValue,
    }).then(createdOption => onSelect(merge(createdOption, { type }), event));
  }

  render() {
    const {
      inputValue,
      children,
      option: { isGroupTitle, isCreatable },
      isFocused,
      isSelected,
    } = this.props;
    if (isGroupTitle) {
      return (
        <Fragment>
          <TitleOption className="Select-option group-title">
            {children}
          </TitleOption>
          <InfoOption className="Select-option">None created yet</InfoOption>
        </Fragment>
      );
    }

    if (isCreatable) {
      if (!inputValue) return null;
      return (
        <CreatableOption className="Select-option">
          <StyledBtn
            type="button"
            color="secondary"
            size="sm"
            onClick={this.onNewOptionClick}
          >
            <Icon name="plus" />
          </StyledBtn>
          {children(inputValue)}
        </CreatableOption>
      );
    }

    return (
      <Option
        className={cx('Select-option', { 'is-selected': isSelected, 'is-focused': isFocused })}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseMove={this.onMouseMove}
      >
        {children}
      </Option>
    );
  }
}

export default GroupSelectOption;
