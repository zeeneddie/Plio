import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../../components/Buttons/Button';

const StandardEditRHSButton = () => {
  const [setIsOpen] = useState(0);
  return (
    <Fragment>
      <Button color="primary" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
    </Fragment>
  );
};

StandardEditRHSButton.propTypes = {
  standardId: PropTypes.string.isRequired,
};

export default StandardEditRHSButton;
