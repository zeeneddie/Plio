import PropTypes from 'prop-types';
import React from 'react';
import { FormSpy } from 'react-final-form';
import { getIn } from 'final-form';

class AutoSave extends React.Component {
  static propTypes = {
    values: PropTypes.object,
    active: PropTypes.string,
    dirty: PropTypes.bool,
    children: PropTypes.func,
    render: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = { submitting: false };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active && this.props.active !== nextProps.active && nextProps.dirty) {
      // blur occurred
      this.save(this.props.active);
    }
  }

  save = async (blurredField) => {
    const {
      values,
      setFieldData,
      save,
      form,
    } = this.props;

    setFieldData(blurredField, { saving: true });

    if (this.promise) {
      await this.promise;
    }

    // something[index].someProp => something[index]
    const field = blurredField.replace(/(\[.*\])(\..*$)/, '$1');
    const value = getIn(values, field);

    this.setState({ submitting: true });

    this.promise = save(value, form);

    await this.promise;

    delete this.promise;

    this.setState({ submitting: false });

    setFieldData(blurredField, { saving: false });
  }

  render() {
    if (!this.props.children || !this.props.render) return null;

    const props = { ...this.state };

    return this.props.children ? this.props.children(props) : this.props.render(props);
  }
}

export default props => (
  <FormSpy
    {...props}
    subscription={{ active: true, values: true, dirty: true }}
    component={AutoSave}
  />
);
