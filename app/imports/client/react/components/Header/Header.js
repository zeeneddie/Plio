import PropTypes from 'prop-types';
import React from 'react';
import { ArrowBack } from './ArrowBack';
import Title from './Title';

const Header = ({ children, ...other }) => (
  <nav className="navbar" {...other}>
    {children}
  </nav>
);

Header.propTypes = {
  children: PropTypes.node,
};

Header.ArrowBack = ArrowBack;
Header.Title = Title;

export default Header;
