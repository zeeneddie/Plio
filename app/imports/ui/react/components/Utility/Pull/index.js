import React, { PropTypes } from 'react';
import cx from 'classnames';

import { pickC } from '/imports/api/helpers';
import { PullMap } from '/imports/api/constants';

const Pull = ({ children, ...other }) => {
  const child = React.Children.only(children);
  const pullCxMap = pickC(Object.keys(other), PullMap);
  const className = cx(...Object.values(pullCxMap), child.props.className);

  return React.cloneElement(children, { className });
};

Pull.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
  ...Object.keys(PullMap).reduce((prev, key) => ({ ...prev, [key]: PropTypes.bool }), {}),
};

export default Pull;
