import React from 'react';
import PropTypes from 'prop-types';
import { mapProps } from 'recompose';

import Header from './Header';
import Body from './Body';

const enhance = mapProps(({
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
}));

const Subcard = enhance(({ children }) => children);

Subcard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

Subcard.Header = Header;
Subcard.Body = Body;

export default Subcard;
