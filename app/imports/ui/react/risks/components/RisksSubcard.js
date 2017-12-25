import React from 'react';
import { CardTitle } from 'reactstrap';
import { Subcard, IconLoading, Pull } from '../../components';
import { withStateToggle } from '../../helpers';

const enhance = withStateToggle(false, 'isOpen', 'toggle');

const RisksSubcard = enhance(({
  isOpen,
  toggle,
  risks,
  isSaving,
}) => (
  <Subcard {...{ isOpen, toggle }}>
    <Subcard.Header>
      <Pull left>
        <CardTitle>Risks</CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {isSaving ? <IconLoading /> : (risks.length || '')}
        </CardTitle>
      </Pull>
    </Subcard.Header>
    <Subcard.Body>
      {'Hello World'}
    </Subcard.Body>
  </Subcard>
));

export default RisksSubcard;
