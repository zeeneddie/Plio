import React, { PropTypes } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { propOr } from 'ramda';

import Subcard from '../../components/Subcard';
import Label from '../../components/Labels/Label';
import AddNewRiskSubcard from './AddNewRiskSubcard';

const enhance = compose(
  withState('title', 'setTitle', propOr('', 'title')),
  withState('originatorId', 'setOriginatorId', propOr('', 'originatorId')),
  withState('ownerId', 'setOwnerId', propOr('', 'ownerId')),
  withHandlers({
    onChangeTitle: ({ setTitle }) => e => setTitle(e.target.value),
    onChangeOriginatorId: ({ setOriginatorId }) => originatorId => setOriginatorId(originatorId),
    onChangeOwnerId: ({ setOwnerId }) => ownerId => setOwnerId(ownerId),
  }),
);

const CreateRiskSubcard = enhance(({
  users,
  id,
  isNew,
  isSaving,
  title,
  originatorId,
  onChangeTitle,
  onChangeOriginatorId,
  onSave,
  onDelete,
}) => (
  <Subcard
    isNew
    disabled
    renderLeftContent={() => [
      'New risk',
      isNew ? <Label names="primary"> New</Label> : null,
    ]}
  >
    <Subcard.SwitchView
      buttons={[
        <span>New</span>,
        <span>Existing</span>,
      ]}
    >
      <AddNewRiskSubcard
        {...{
          users,
          title,
          originatorId,
          onChangeTitle,
          onChangeOriginatorId,
        }}
      />
      <span>World Hello</span>
    </Subcard.SwitchView>
    <Subcard.Footer
      isNew
      {...{
        onSave,
        onDelete,
        isSaving,
        title,
        id,
      }}
    />
  </Subcard>
));

CreateRiskSubcard.propTypes = {
  id: PropTypes.string.isRequired,
  isSaving: PropTypes.bool,
  isNew: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CreateRiskSubcard;
