import React from 'react';
import { Subcard } from '../../components';
import { withStateToggle } from '../../helpers';
import RisksSubcardHeader from './RisksSubcardHeader';
import RisksSubcardBody from './RisksSubcardBody';

const enhance = withStateToggle(false, 'isOpen', 'toggle');

const RisksSubcard = enhance(({
  isOpen,
  toggle,
  risks,
  isSaving,
}) => (
  <Subcard {...{ isOpen, toggle }}>
    <Subcard.Header>
      <RisksSubcardHeader length={risks.length} {...{ isSaving }} />
    </Subcard.Header>
    <Subcard.Body>
      <RisksSubcardBody {...{ risks, isSaving }} />
    </Subcard.Body>
  </Subcard>
));

export default RisksSubcard;
