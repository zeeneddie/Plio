import React from 'react';
import PropTypes from 'prop-types';

import {
  CardBlock,
  Subcard,
  SubcardHeader,
  SubcardBody,
  SubcardManager,
  SubcardManagerButton,
  SubcardManagerList,
} from '../../components';
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
  <Subcard {...{ isOpen, toggle }}>
    <SubcardHeader>
      <RisksSubcardHeader length={risks.length} {...{ isSaving }} />
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <RiskSubcardList {...{ risks, isSaving }} />
        <SubcardManager
          render={card => (
            <RiskSubcardNewContainer
              key={card.id}
              {...{ card, standardId, onSave }}
            />
          )}
        >
          <SubcardManagerList />
          <SubcardManagerButton>
            Add a new risk
          </SubcardManagerButton>
        </SubcardManager>
      </CardBlock>
    </SubcardBody>
  </Subcard>
));

RisksSubcard.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  standardId: PropTypes.string.isRequired,
  isSaving: PropTypes.bool,
};

export default RisksSubcard;
