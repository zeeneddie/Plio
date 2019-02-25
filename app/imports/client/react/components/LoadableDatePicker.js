/* eslint-disable react/prop-types */

import React from 'react';
import Loadable from 'react-loadable';
import moment from 'moment';
import styled from 'styled-components';
import { Button } from 'reactstrap';

import { Icon } from './';
import Preloader from './Preloader';

const StyledButton = styled(Button)`
  margin-left: 15px;
  height: 35px;
`;

const LoadableDatePicker = Loadable.Map({
  loader: {
    DatePicker: () => import('react-datepicker'),
    css: () => import('react-datepicker/dist/react-datepicker.css'),
  },
  loading: () => <Preloader size={1} />,
  render: ({
    DatePicker: { default: DatePicker },
  }, {
    selected,
    placeholderText,
    placeholderDate,
    isClearable,
    dateFormat = 'DD MMM YYYY',
    className,
    readOnly = true,
    onChange,
    onDelete,
    ...props
  }) => (
    // trick to get around date picker unable to pass className to input wrapper...
    <div {...{ className }}>
      <DatePicker
        fixedHeight
        className="form-control"
        selected={selected ? moment(selected) : null}
        popperClassName={className}
        placeholderText={
          placeholderDate ? moment(placeholderDate).format(dateFormat) : placeholderText
        }
        {...{
          dateFormat,
          readOnly,
          onChange,
          ...props,
        }}
      />
      {isClearable && (
        <StyledButton
          className="btn-icon"
          onClick={() => {
            onChange(null);
            if (onDelete) onDelete();
          }}
        >
          <Icon name="times-circle" />
        </StyledButton>
      )}
    </div>
  ),
});

// Default display is inline-block
// Maybe this should be an option?
export default styled(LoadableDatePicker)`
  display: flex;
  & > div {
    flex: 1;
    & > .react-datepicker-wrapper {
      display: block;
  
      & > .react-datepicker__input-container {
        display: block;
        & > input[readonly]:not([disabled]) {
          cursor: pointer;
          background-color: #fff;
        }
      }
    }

    & > .react-datepicker-popper {
      z-index: 999;
    }
  }
`;
