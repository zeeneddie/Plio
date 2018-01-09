import React from 'react';
import PropTypes from 'prop-types';
import { mapProps, branch, compose } from 'recompose';
import { prop, identity } from 'ramda';

import { defer } from '../../helpers';

import Header from './Header';
import Body from './Body';
import New from './New';

const enhance = compose(
  branch(
    prop('defer'),
    defer,
    identity,
  ),
  branch(
    prop('disabled'),
    mapProps(props => ({ ...props, isOpen: true, toggle: () => null })),
    identity,
  ),
  mapProps(({
    children,
    isOpen,
    toggle,
    ...props
  }) => ({
    ...props,
    children: React.Children.map(children, (child) => {
      switch (child.type) {
        case Header:
          return React.cloneElement(child, { isOpen, onClick: toggle });
        case Body:
          return React.cloneElement(child, { isOpen });
        default:
          return child;
      }
    }),
  })),
);

const Subcard = enhance(({ children }) => children);

Subcard.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

Subcard.Header = Header;
Subcard.Body = Body;
Subcard.New = New;

export default Subcard;
