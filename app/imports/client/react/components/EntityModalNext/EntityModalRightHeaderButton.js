import PropTypes from 'prop-types';
import React from 'react';
import { FormSpy } from 'react-final-form';

import { SaveButton, Button } from '../Buttons';
import { Consumer } from './EntityModal';

const EntityModalRightHeaderButton = ({ label, ...props }) => (
  <Consumer>
    {({
      loading,
      isEditMode,
      toggle,
      noForm,
    }) => noForm ? (
      <Button color="secondary" onClick={toggle}>{label || 'Close'}</Button>
    ) : (
      <FormSpy subscription={{ submitting: true, active: true, dirty: true }}>
        {({
          submitting,
          active,
          dirty,
          form: { submit },
        }) => (
          <SaveButton
            isSaving={loading || submitting}
            color={isEditMode ? 'secondary' : 'primary'}
            onClick={event => !isEditMode && submit(event)}
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
            {...props}
          >
            {label || (isEditMode ? 'Close' : 'Save')}
          </SaveButton>
        )}
      </FormSpy>
    )}
  </Consumer>
);

EntityModalRightHeaderButton.propTypes = {
  label: PropTypes.string,
};

export default EntityModalRightHeaderButton;
