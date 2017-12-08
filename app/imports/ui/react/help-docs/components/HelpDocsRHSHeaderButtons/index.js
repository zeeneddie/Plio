import React from 'react';

import Button from '../../../components/Buttons/Button';
import ToggleExpandButton from '../../../components/Buttons/ToggleExpandButton';
import propTypes from './propTypes';

const HelpDocsRHSHeaderButtons = props => (
  <div>
    {props.hasDocxAttachment ? (
      <ToggleExpandButton onClick={props.onToggleScreenMode} />
    ) : ''}

    {props.userHasChangeAccess ? (
      <Button color="primary" onClick={props.onModalOpen}>
        Edit
      </Button>
    ) : ''}
  </div>
);

HelpDocsRHSHeaderButtons.propTypes = propTypes;

export default HelpDocsRHSHeaderButtons;
