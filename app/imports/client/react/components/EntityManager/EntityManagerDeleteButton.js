import PropTypes from 'prop-types';
import React from 'react';
import { FormSpy } from 'react-final-form';
import { Button } from 'reactstrap';

import { Consumer } from './EntityManagerCards';

const EntityManagerDeleteButton = ({ children, ...props }) => (
  <FormSpy subscription={{ submitting: true }}>
    {({ submitting }) => (
      <Consumer>
        {({ field: { index }, fields }) => (
          <Button
            color="secondary"
            disabled={submitting}
            onClick={() => !submitting && fields.remove(index)}
            {...props}
          >
            {children}
          </Button>
        )}
      </Consumer>
    )}
  </FormSpy>
);

EntityManagerDeleteButton.defaultProps = {
  children: 'Delete',
};

EntityManagerDeleteButton.propTypes = {
  children: PropTypes.node,
};

export default EntityManagerDeleteButton;
