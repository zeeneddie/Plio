import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import { withApollo } from '../../helpers';
import Button from '../../components/Buttons/Button';
import StandardEditContainer from '../containers/StandardEditContainer';
import StandardEditModal from './StandardEditModal';

const StandardEditRHSButton = ({ standardId, organizationId }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Fragment>
      <Button color="primary" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
      <StandardEditContainer
        {...{ organizationId, standardId, isOpen }}
        toggle={() => setIsOpen(false)}
        component={StandardEditModal}
      />
    </Fragment>
  );
};

StandardEditRHSButton.propTypes = {
  standardId: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default withApollo(StandardEditRHSButton);
