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
  // eslint-disable-next-line react/prop-types
  render: ({ DatePicker: { default: DatePicker } }, { selected, ...props }) => (
    <DatePicker
      selected={selected ? moment(selected) : null}
      {...props}
    />
  ),
});
