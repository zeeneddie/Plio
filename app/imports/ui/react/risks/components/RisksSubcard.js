import React from 'react';

import { Subcard, CardBlock } from '../../components';
import { withStateToggle } from '../../helpers';
import RisksSubcardHeader from './RisksSubcardHeader';
import RiskSubcardList from './RiskSubcardList';

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
      <CardBlock>
        <RiskSubcardList {...{ risks, isSaving }} />
        <Subcard.New
          render={({ id }) => <div key={id}>Hello World</div>}
        >
          <Subcard.New.List />
          <Subcard.New.Button>
            Add a new risk
          </Subcard.New.Button>
        </Subcard.New>
      </CardBlock>
    </Subcard.Body>
  </Subcard>
));

export default RisksSubcard;
