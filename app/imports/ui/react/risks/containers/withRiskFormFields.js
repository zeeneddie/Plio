import connectUI from 'redux-ui';
import { compose, withHandlers } from 'recompose';

import { lenses, viewOr } from '../../../../client/util';

export default compose(
  connectUI({
    state: {
      title: '',
      description: '',
      originatorId: viewOr('', lenses.userId),
      ownerId: viewOr('', lenses.userId),
      magnitude: '',
      typeId: viewOr('', lenses.types.head.value),
      riskId: '',
    },
  }),
  withHandlers({
    onChangeTitle: ({ updateUI }) => e => updateUI('title', e.target.value),
    onChangeDescription: ({ updateUI }) => e => updateUI('description', e.target.value),
    onChangeOriginatorId: ({ updateUI }) => (_, { value }, cb) =>
      updateUI('originatorId', value, cb),
    onChangeOwnerId: ({ updateUI }) => (_, { value }, cb) =>
      updateUI('ownerId', value, cb),
    onChangeMagnitude: ({ updateUI }) => e => updateUI('magnitude', e.target.value),
    onChangeTypeId: ({ updateUI }) => e => updateUI('typeId', e.target.value),
    onChangeRiskId: ({ updateUI }) => (_, { value }, cb) =>
      updateUI('riskId', value, cb),
    onChangeActiveView: ({ updateUI }) => idx => updateUI('activeView', idx),
  }),
);
