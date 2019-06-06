import React, { memo, useCallback } from 'react';
import moment from 'moment-timezone';
import { sortWith, ascend, compose, prop, map } from 'ramda';

import SelectField from './SelectField';

const getTimezones = compose(
  sortWith([
    ascend(prop('name')),
    ascend(({ gmtOffset }) => parseInt(gmtOffset, 10)),
  ]),
  map((name) => {
    const gmtOffset = moment.tz(name).format('Z');
    const prettyName = `(GMT ${gmtOffset}) ${name.replace('_', ' ')}`;

    return { label: prettyName, value: name, gmtOffset };
  }),
  moment.tz.names.bind(moment.tz),
);

const TimezoneSelect = memo((props) => {
  const getTzs = useCallback(getTimezones, []);
  return (
    <SelectField
      {...props}
      initialValue={moment.tz.guess()}
      options={getTzs()}
    />
  );
});

export default TimezoneSelect;
