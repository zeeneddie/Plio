import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { pickC, omitC } from '../../../../../api/helpers';
import { PullMap } from '../../../../../api/constants';

const Pull = ({ children, className: cn, ...other }) => {
  const child = React.Children.only(children);
  const pullCxMap = pickC(Object.keys(other), PullMap);
  const className = cx(...Object.values(pullCxMap), cn, child.props.className);
  const withoutPullValues = omitC(Object.keys(PullMap), other);

  return React.cloneElement(children, { className, ...withoutPullValues });
};

Pull.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
  ...Object.keys(PullMap).reduce((prev, key) => ({ ...prev, [key]: PropTypes.bool }), {}),
};

export default Pull;
