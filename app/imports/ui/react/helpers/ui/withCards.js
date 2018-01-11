import connectUI from 'redux-ui';
import { connect } from 'react-redux';
import { Random } from 'meteor/random';
import { reject } from 'ramda';
import { compose, withHandlers } from 'recompose';
import { lenses } from 'plio-util';

import { lensEq } from '../../../../client/util';

export const UI_ADD_CARD = 'UI_ADD_CARD';

export const UI_REMOVE_CARD = 'UI_REMOVE_CARD';

export default compose(
  connectUI({
    state: {
      cards: [],
    },
    reducer: (state, action) => {
      switch (action.type) {
        case UI_ADD_CARD: {
          const cards = state.get('cards').concat({ id: Random.id() });
          return state.set('cards', cards);
        }
        case UI_REMOVE_CARD: {
          const cards = reject(lensEq(lenses.id, action.payload.id), state.get('cards'));
          return state.set('cards', cards);
        }
        default:
          return state || {};
      }
    },
  }),
  connect(),
  withHandlers({
    onAddCard: ({ dispatch }) => () => dispatch({ type: UI_ADD_CARD }),
    onRemoveCard: ({ dispatch }) => id => dispatch({ type: UI_REMOVE_CARD, payload: { id } }),
  }),
);
