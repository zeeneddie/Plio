import React, { PropTypes } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { propOr, either, view } from 'ramda';
import ui from 'redux-ui';

import Subcard from '../../components/Subcard';
import Label from '../../components/Labels/Label';
import { lenses } from '../../../../client/util';
import AddNewRiskSubcard from './AddNewRiskSubcard';
import AddExistingRiskSubcardContainer from '../containers/AddExistingRiskSubcardContainer';

const enhance = compose(
  withState('title', 'setTitle', propOr('', 'title')),
  withState('description', 'setDescription', propOr('', 'description')),
  // default to current user id if no originatorId is passed
  withState(
    'originatorId',
    'setOriginatorId',
    either(
      view(lenses.originatorId),
      view(lenses.userId),
    ),
  ),
  withState(
    'ownerId',
    'setOwnerId',
    either(
      view(lenses.ownerId),
      view(lenses.userId),
    ),
  ),
  withState('magnitude', 'setMagnitude', propOr('', 'magnitude')),
  withState(
    'typeId',
    'setTypeId',
    either(
      view(lenses.typeId),
      view(lenses.types.head.value),
    ),
  ),
  withState('riskId', 'setRiskId', propOr('', 'riskId')),
  withHandlers({
    onChangeTitle: ({ setTitle }) => e => setTitle(e.target.value),
    onChangeDescription: ({ setDescription }) => e => setDescription(e.target.value),
    onChangeOriginatorId: ({ setOriginatorId }) => (_, { value }, cb) =>
      setOriginatorId(value, cb),
    onChangeOwnerId: ({ setOwnerId }) => (_, { value }, cb) =>
      setOwnerId(value, cb),
    onChangeMagnitude: ({ setMagnitude }) => e => setMagnitude(e.target.value),
    onChangeTypeId: ({ setTypeId }) => e => setTypeId(e.target.value),
    onChangeRiskId: ({ setRiskId }) => (_, { value }, cb) =>
      setRiskId(value, cb),
  }),
  withState('activeView', 'setActiveView', propOr(0, 'activeView')),
  ui(),
);

const CreateRiskSubcard = enhance(({
  users,
  types,
  risks,
  isNew,
  isSaving,
  title,
  description,
  originatorId,
  ownerId,
  magnitude,
  typeId,
  riskId,
  onChangeTitle,
  onChangeDescription,
  onChangeOriginatorId,
  onChangeOwnerId,
  onChangeMagnitude,
  onChangeTypeId,
  onChangeRiskId,
  onSave,
  onDelete,
  guidelines,
  standard,
  activeView,
  setActiveView,
  ui: { error },
}) => (
  <Subcard
    isNew
    disabled
    renderLeftContent={() => [
      'New risk',
      isNew ? <Label names="primary"> New</Label> : null,
    ]}
    errorText={error}
  >
    <Subcard.SwitchView
      buttons={[
        <span>New</span>,
        <span>Existing</span>,
      ]}
      onChange={setActiveView}
      active={activeView}
    >
      <AddNewRiskSubcard
        {...{
          users,
          types,
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
          guidelines,
          standard,
        }}
      />
      <AddExistingRiskSubcardContainer
        selected={riskId}
        onChange={onChangeRiskId}
        {...{ risks }}
      />
    </Subcard.SwitchView>
    <Subcard.Footer
      isNew
      {...{
        onSave,
        onDelete,
        isSaving,
        title,
        description,
        originatorId,
        ownerId,
        magnitude,
        typeId,
        riskId,
        activeView,
      }}
    />
  </Subcard>
));

CreateRiskSubcard.propTypes = {
  userId: PropTypes.string.isRequired,
  isSaving: PropTypes.bool,
  isNew: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CreateRiskSubcard;
