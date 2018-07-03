import PropTypes from 'prop-types';
import React from 'react';
import { withContext } from 'recompose';

const enhance = withContext(
  { subFormName: PropTypes.string },
  props => ({
    subFormName: props.name,
  }),
);

const SubForm = ({ children }) => (
  <div>{children}</div>
);

SubForm.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default enhance(SubForm);
