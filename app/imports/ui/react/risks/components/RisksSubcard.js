import React from 'react';
import PropTypes from 'prop-types';

import { Subcard, CardBlock } from '../../components';
import { withStateToggle } from '../../helpers';
import RisksSubcardHeader from './RisksSubcardHeader';
import RiskSubcardList from './RiskSubcardList';
import RiskSubcardNewContainer from '../containers/RiskSubcardNewContainer';

const enhance = withStateToggle(false, 'isOpen', 'toggle');
const RisksSubcard = enhance(({
  isOpen,
  toggle,
  risks,
  isSaving,
  standardId,
  onSave,
}) => (
  <Subcard defer {...{ isOpen, toggle }}>
    <Subcard.Header>
      <RisksSubcardHeader length={risks.length} {...{ isSaving }} />
    </Subcard.Header>
    <Subcard.Body>
      <CardBlock>
        <RiskSubcardList {...{ risks, isSaving }} />
        <Subcard.New
          render={card => (
            <RiskSubcardNewContainer
              key={card.id}
              {...{ card, standardId, onSave }}
            />
          )}
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

RisksSubcard.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  standardId: PropTypes.string.isRequired,
  isSaving: PropTypes.bool,
};

export default RisksSubcard;
