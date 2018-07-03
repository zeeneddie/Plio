import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cx from 'classnames';
import { Input } from 'reactstrap';

class Select extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoading: false,
      options: props.options || [],
    };
  }

  componentDidMount() {
    if (this.props.loadOptions) {
      this.loadOptions();
    }
  }

  loadOptions() {
    const { loadOptions } = this.props;

    const callback = ({ options = [] } = {}) => {
      this.setState({
        options,
        isLoading: false,
      });
    };

    loadOptions()
      .then(callback)
      .catch(callback);

    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
    }
  }

  render() {
    const {
      value,
      className,
      onChange,
      loadOptions,
      ...rest
    } = this.props;
    const { options } = this.state;

    return (
      <Input
        type="select"
        className={cx('c-select', className)}
        {...{ value, onChange, ...rest }}
      >
        {options.map(option => (
          <option key={`${option.text}-${option.value}`} value={option.value}>
            {option.text}
          </option>
        ))}
      </Input>
    );
  }
}

Select.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  })),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  loadOptions: PropTypes.func,
};

export default Select;
