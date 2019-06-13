import React from 'react';
import PropTypes from 'prop-types';
import { map, merge, append, unnest, reduce, reject, isNil, compose, prop, identity } from 'ramda';

import ApolloSelectInputField from './ApolloSelectInputField';
import GroupSelectOption from './GroupSelectOption';
import GroupSelectValue from './GroupSelectValue';

const concatAll = compose(
  reject(isNil),
  unnest,
);
const extendOptions = compose(
  reduce((options, {
    label,
    value,
    type,
    button,
    options: embeddedOptions,
  }) => {
    if (!embeddedOptions) return append({ label, value }, options);
    const titleOption = { label, isGroupTitle: true };
    const extendedEmbeddedOptions = map(merge({ type }), embeddedOptions);
    const buttonOption = button && {
      type,
      isCreatable: true,
      label: button.label,
      onClick: button.onClick,
    };
    return concatAll([
      options,
      titleOption,
      extendedEmbeddedOptions,
      buttonOption,
    ]);
  }, []),
  prop('options'),
);

const GroupSelect = ({
  onNewOptionClick, transformOptions, loadOptions, ...props
}) => (
  <ApolloSelectInputField
    {...{ loadOptions, ...props }}
    transformOptions={compose(extendOptions, transformOptions)}
    optionComponent={GroupSelectOption}
    valueRenderer={GroupSelectValue}
    filterOption={({
      isGroupTitle,
      isCreatable,
      label,
      type,
    }, filterString) => {
      const pattern = new RegExp(filterString, 'i');
      return isCreatable || isGroupTitle || pattern.test(label) || pattern.test(type);
    }}
  />
);

GroupSelect.defaultProps = {
  multi: true,
  transformOptions: identity,
};

GroupSelect.propTypes = {
  loadOptions: PropTypes.func.isRequired,
  multi: PropTypes.bool,
  onNewOptionClick: PropTypes.func,
  transformOptions: PropTypes.func,
};

export default GroupSelect;
