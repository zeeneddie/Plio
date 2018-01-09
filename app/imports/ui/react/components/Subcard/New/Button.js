import React from 'react';
import PropTypes from 'prop-types';

import { TextAlign, Button } from '../..';

const SubcardNewButton = ({ onClick, children, ...props }) => (
  <TextAlign center>
    <div>
      <Button color="link" {...{ onClick, ...props }}>
        {children}
      </Button>
    </div>
  </TextAlign>
);

SubcardNewButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default SubcardNewButton;
