import React from 'react';

import Button from './Button';

const RadioButton = ({ children, ...props }) => (
  <Button color="secondary" component="label" {...props}>
    <input type="radio" />
    {children}
  </Button>
);

RadioButton.propTypes = {
  // eslint-disable-next-line react/no-typos
  children: Button.propTypes.children,
};

export default RadioButton;
