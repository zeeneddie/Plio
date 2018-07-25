import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { TimeUnits } from '../../../../../share/constants';

const TimePicker = (props) => {
  const timeUnits = props.timeUnits || _.values(TimeUnits);
  const isSelectedTimeUnit = unit => unit === props.timeUnit;

  return (
    <div className={cx('input-group', props.className)}>
      <input
        type="number"
        className="form-control"
        min="1"
        value={props.timeValue}
        onChange={props.onTimeValueInputChanged}
        onBlur={props.onTimeValueChanged}
      />

      <span className="input-group-btn dropdown">
        <button
          type="button"
          className="btn btn-secondary dropdown-toggle"
          data-toggle="dropdown"
        >
          {props.timeUnit}
        </button>

        <div className="dropdown-menu dropdown-menu-right">
          {timeUnits.map(unit => (
            <a
              key={unit}
              className={cx('dropdown-item', {
                active: isSelectedTimeUnit(unit),
              })}
              onClick={() => props.onTimeUnitChanged(unit)}
            >
              {unit}
            </a>
          ))}
        </div>
      </span>
    </div>
  );
};

TimePicker.propTypes = {
  className: PropTypes.string,
  onTimeUnitChanged: PropTypes.func,
  onTimeValueChanged: PropTypes.func,
  onTimeValueInputChanged: PropTypes.func,
  timeUnits: PropTypes.array,
  timeUnit: PropTypes.string,
  timeValue: PropTypes.number,
};

export default TimePicker;
