import PropTypes from 'prop-types';
import React from 'react';
import { FormSpy } from 'react-final-form';
import { pure } from 'recompose';

import { SaveButton } from '../Buttons';

const RightHeaderButton = ({
  loading,
  isEditMode,
  toggle,
}) => (
  <FormSpy subscription={{ submitting: true, active: true, dirty: true }}>
    {({ submitting, active, dirty }) => (
      <SaveButton
        isSaving={loading || submitting}
        color={isEditMode ? 'secondary' : 'primary'}
        type="submit"
        onMouseDown={() => {
          // display saving state when clicking on "Close" button
          // while being focused on the input
          if (isEditMode) {
            if (active && dirty) {
              setTimeout(toggle, 400);
            } else {
              toggle();
            }
          }
        }}
      >
        {isEditMode ? 'Close' : 'Save'}
      </SaveButton>
    )}
  </FormSpy>
);

RightHeaderButton.propTypes = {
  loading: PropTypes.bool,
  isEditMode: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
};

export default pure(RightHeaderButton);
