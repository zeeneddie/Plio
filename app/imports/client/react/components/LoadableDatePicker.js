/* eslint-disable react/prop-types */

import React from 'react';
import Loadable from 'react-loadable';
import moment from 'moment';
import styled from 'styled-components';

import Preloader from './Preloader';

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
    dateFormat = 'DD MMM YYYY',
    className,
    readOnly = true,
    ...props
  }) => (
    // trick to get around date picker unable to pass className to input wrapper...
    <div {...{ className }}>
      <DatePicker
        fixedHeight
        className="form-control"
        selected={selected ? moment(selected) : null}
        popperClassName={className}
        {...{ dateFormat, readOnly, ...props }}
      />
    </div>
  ),
});

// Default display is inline-block
// Maybe this should be an option?
export default styled(LoadableDatePicker)`
  & > div {
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
