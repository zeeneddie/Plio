import { compose, withHandlers, withContext } from 'recompose';
import { connect } from 'react-redux';
import ui from 'redux-ui';
import { PropTypes } from 'prop-types';

import RisksSubcard from '../components/RisksSubcard';
import { insert, linkStandard } from '../../../../api/risks/methods';
import _modal_ from '../../../../startup/client/mixins/modal';
import store from '../../../../client/store';
import {
  getOrganizationId,
} from '../../../../client/store/selectors/organizations';
import { getRisksLinkedToStandard } from '../../../../client/store/selectors/risks';

const saveNew = ({
  title,
  description,
  originatorId,
  ownerId,
  magnitude,
  typeId,
  organizationId,
  standardId,
}, cb) => {
  const args = {
    title,
    description,
    originatorId,
    ownerId,
    magnitude,
    typeId,
    organizationId,
    standardId,
    standardsIds: [standardId],
  };

  const invalid = Object.keys(args).some((key) => {
    if (key !== 'description' && !args[key]) {
      const message =
        `The new risk cannot be created without a ${key}. Please enter a key for your risk`;
      cb({ message });
      return true;
    }
    return false;
  });

  if (invalid) return invalid;

  // TEMP
  // because edit modal is still in blaze
  return _modal_.modal.callMethod(insert, args, cb);
};

const linkExisting = ({ riskId: _id, standardId }, cb) => {
  const args = { _id, standardId };
  return _modal_.modal.callMethod(linkStandard, args, cb);
};

export default compose(
  // TEMP
  withContext(
    { store: PropTypes.object },
    () => ({ store }),
  ),
  connect((state, { standardId }) => ({
    organizationId: getOrganizationId(state),
    risks: getRisksLinkedToStandard(state, { standardId }),
  })),
  ui({
    state: {
      error: null,
      opened: null,
      isSaving: false,
      activeView: 0,
    },
  }),
  withHandlers({
    onSave: ({
      organizationId,
      updateUI,
      standardId,
      ui: { activeView },
    }) => ({ card, ...props }) => {
      updateUI('isSaving', true);
      const cb = (err, id) => {
        updateUI('isSaving', false);

        if (err) return updateUI('error', err.message);

        updateUI('error', null);

        // remove subcard from ui
        card.onDelete();

        return updateUI('opened', id);
      };

      if (activeView === 0) {
        return saveNew({
          ...props,
          organizationId,
          standardId,
        }, cb);
      }

      const { riskId } = props;

      return linkExisting({
        riskId,
        standardId,
      }, cb);
    },
  }),
)(RisksSubcard);
