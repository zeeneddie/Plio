import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import { TextAlign } from './Utility';

const SubcardManagerButton = ({ onClick, children, ...props }) => (
  <TextAlign center>
    <div>
      <Button color="link" {...{ onClick, ...props }}>
        {children}
      </Button>
    </div>
  </TextAlign>
);

SubcardManagerButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default SubcardManagerButton;
