import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { pickC, omitC } from '../../../../../api/helpers';
import { TextAlignMap } from '../../../../../api/constants';

const TextAlign = ({ className: cn, children, ...other }) => {
  const child = React.Children.only(children);
  const textAlignCxMap = pickC(Object.keys(other), TextAlignMap);
  const className = cx(...Object.values(textAlignCxMap), cn, child.props.className);
  const withoutTextAlignValues = omitC(Object.keys(TextAlignMap), other);

  return React.cloneElement(child, { className, ...withoutTextAlignValues });
};

TextAlign.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
  ...Object.keys(TextAlignMap).reduce((prev, key) => ({ ...prev, [key]: PropTypes.bool }), {}),
};

export default TextAlign;
