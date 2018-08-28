import React from 'react';
import { FormSpy } from 'react-final-form';

import { SaveButton } from '../Buttons';
import { Consumer } from './EntityModal';

const EntityModalRightHeaderButton = props => (
  <Consumer>
    {({ loading, isEditMode, toggle }) => (
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
            onClick={submit}
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
            {isEditMode ? 'Close' : 'Save'}
          </SaveButton>
        )}
      </FormSpy>
    )}
  </Consumer>
);

export default EntityModalRightHeaderButton;
