import PropTypes from 'prop-types';
import React from 'react';
import { $ } from 'meteor/jquery';
import cx from 'classnames';

import { getFormattedDate } from '../../../../../share/helpers';

export default class DatePicker extends React.Component {
  static get propTypes() {
    return {
      className: PropTypes.string,
      value: PropTypes.instanceOf(Date),
      disabled: PropTypes.bool,
      onChange: PropTypes.func,
      placeholder: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      disabled: false,
      placeholder: 'Select date',
    };
  }

  componentDidMount() {
    const datepicker = $(this.datepicker);

    datepicker.datepicker({
      todayHighlight: true,
      format: 'd M',
      autoclose: true,
    });

    datepicker.on('changeDate', (e) => {
      if (this.props.onChange) this.props.onChange(e);
    });
  }

  _dateString() {
    return this.props.value ? getFormattedDate(this.props.value, 'DD MMM') : '';
  }

  render() {
    return (
      <input
        type="text"
        className={cx('form-control', 'datepicker', this.props.className)}
        readOnly
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}
        value={this._dateString()}
        ref={(node) => { this.datepicker = node; }}
      />
    );
  }
}
