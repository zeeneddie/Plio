/* eslint-disable react/prop-types */

import React from 'react';
import Loadable from 'react-loadable';
import moment from 'moment';

import Preloader from './Preloader';

export default Loadable.Map({
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
    ...props
  }) => (
    <DatePicker
      selected={selected ? moment(selected) : null}
      {...{ dateFormat, ...props }}
    />
  ),
});
