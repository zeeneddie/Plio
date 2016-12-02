import React from 'react';

import ToggleExpandButton from '../../../components/ToggleExpandButton';
import EditButton from '../../../components/EditButton';
import propTypes from './propTypes';

const HelpDocsRHSHeaderButtons = (props) => (
  <div>
    {props.hasDocxAttachment ? (
      <ToggleExpandButton onClick={props.onToggleScreenMode} />
    ) : ''}

    <EditButton
      onClick={props.onModalOpen}
      title="Edit"
    />
  </div>
);

HelpDocsRHSHeaderButtons.propTypes = propTypes;

export default HelpDocsRHSHeaderButtons;
