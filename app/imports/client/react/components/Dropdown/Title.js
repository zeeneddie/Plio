import PropTypes from 'prop-types';
import React from 'react';
import { _ } from 'meteor/underscore';
import { mapProps } from 'recompose';
import TextInput from '/imports/client/react/forms/components/TextInput';

const replaceValue = (string, value) =>
  string.replace('@value', value);

const enhance = mapProps(props => ({
  ...props,
  children: React.Children.map(props.children, (child) => {
    if (_.isString(child)) {
      return replaceValue(child, props.dropdownValue);
    }

    if (_.isString(child.props && child.props.children)) {
      return React.cloneElement(child, {
        children: replaceValue(child.props.children, props.dropdownValue),
      });
    }

    if (child.type === TextInput) {
      return React.cloneElement(child, {
        value: replaceValue(child.props.value, props.dropdownValue),
      });
    }

    return child;
  }),
}));

export const Title = enhance((props) => {
  const {
    children, as = 'a', dropdownValue, ...other
  } = props;

  return React.createElement(as, { 'data-toggle': 'dropdown', ...other }, children);
});

Title.propTypes = {
  className: PropTypes.string,
  dropdownValue: PropTypes.string,
  children: PropTypes.node,
};
