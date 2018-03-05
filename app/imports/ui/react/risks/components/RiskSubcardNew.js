import React from 'react';
import PropTypes from 'prop-types';
import { shouldUpdate } from 'recompose';
import { equals } from 'ramda';

import {
  Subcard,
  SwitchView,
  CardBlock,
  Button,
  SaveButton,
  ErrorSection,
  SubcardHeader,
  SubcardBody,
} from '../../components';
import RiskSubcardAddNewContainer from '../containers/RiskSubcardAddNewContainer';
import { namedCompose } from '../../helpers';
import RiskSubcardAddExistingContainer from '../containers/RiskSubcardAddExistingContainer';

const enhance = namedCompose('RiskSubcardNew')(
  shouldUpdate((props, nextProps) => !!(
    props.isNew !== nextProps.isNew ||
    props.ui.activeView !== nextProps.ui.activeView ||
    props.ui.title !== nextProps.ui.title ||
    props.ui.description !== nextProps.ui.description ||
    props.ui.originatorId !== nextProps.ui.originatorId ||
    props.ui.ownerId !== nextProps.ui.ownerId ||
    props.ui.magnitude !== nextProps.ui.magnitude ||
    props.ui.typeId !== nextProps.ui.typeId ||
    props.ui.isSaving !== nextProps.ui.isSaving ||
    props.ui.riskId !== nextProps.ui.riskId ||
    props.ui.error !== nextProps.ui.error ||
    props.standardId !== nextProps.standardId ||
    !equals(props.types, nextProps.types) ||
    !equals(props.card, nextProps.card)
  )),
);

const RiskSubcardNew = enhance(({
  card,
  ui: {
    activeView,
    title,
    description,
    originatorId,
    ownerId,
    magnitude,
    typeId,
    riskId,
    isSaving,
    error,
  },
  onChangeTitle,
  onChangeDescription,
  onChangeOriginatorId,
  onChangeOwnerId,
  onChangeMagnitude,
  onChangeTypeId,
  onChangeActiveView,
  onChangeRiskId,
  standardId,
  types,
  onSave,
}) => (
  <Subcard disabled>
    <SubcardHeader isNew>
      New risk
    </SubcardHeader>
    <SubcardBody>
      <ErrorSection errorText={error} />
      <SwitchView
        buttons={[
          <span>New</span>,
          <span>Existing</span>,
        ]}
        onChange={onChangeActiveView}
        active={activeView}
      >
        <RiskSubcardAddNewContainer
          {...{
            title,
            description,
            originatorId,
            ownerId,
            magnitude,
            typeId,
            onChangeTitle,
            onChangeDescription,
            onChangeOriginatorId,
            onChangeOwnerId,
            onChangeMagnitude,
            onChangeTypeId,
            types,
            standardId,
          }}
        />
        <RiskSubcardAddExistingContainer
          selected={riskId}
          onChange={onChangeRiskId}
          {...{ standardId }}
        />
      </SwitchView>
      <CardBlock>
        <SaveButton
          color="secondary"
          pull="right"
          onClick={e => !isSaving && onSave({
            title,
            description,
            originatorId,
            ownerId,
            magnitude,
            typeId,
            riskId,
            activeView,
            card,
          }, e)}
          {...{ isSaving }}
        />
        <Button
          color="secondary"
          pull="left"
          disabled={isSaving}
          onClick={() => !isSaving && card.onDelete()}
        >
          Delete
        </Button>
      </CardBlock>
    </SubcardBody>
  </Subcard>
));

RiskSubcardNew.propTypes = {
  ui: PropTypes.shape({
    activeView: PropTypes.number,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    originatorId: PropTypes.string.isRequired,
    ownerId: PropTypes.string.isRequired,
    magnitude: PropTypes.string.isRequired,
    typeId: PropTypes.string.isRequired,
    riskId: PropTypes.string.isRequired,
    isSaving: PropTypes.bool,
  }).isRequired,
  card: PropTypes.object.isRequired,
  types: PropTypes.arrayOf(PropTypes.object).isRequired,
  standardId: PropTypes.string,
  onChangeTitle: PropTypes.func.isRequired,
  onChangeDescription: PropTypes.func.isRequired,
  onChangeOriginatorId: PropTypes.func.isRequired,
  onChangeOwnerId: PropTypes.func.isRequired,
  onChangeMagnitude: PropTypes.func.isRequired,
  onChangeTypeId: PropTypes.func.isRequired,
  onChangeActiveView: PropTypes.func,
};

export default RiskSubcardNew;
