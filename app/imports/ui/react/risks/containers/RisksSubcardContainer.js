import { compose, withHandlers, withContext } from 'recompose';
import { connect } from 'react-redux';
import ui from 'redux-ui';
import { PropTypes } from 'prop-types';

import RisksSubcard from '../components/RisksSubcard';
import { insert, linkStandard } from '../../../../api/risks/methods';
import _modal_ from '../../../../startup/client/mixins/modal';
import {
  getSortedUsersByFirstNameAsItems,
} from '../../../../client/store/selectors/users';
import store from '../../../../client/store';
import { getUserId } from '../../../../client/store/selectors/global';
import {
  getRiskGuidelines,
  getOrganizationId,
} from '../../../../client/store/selectors/organizations';
import { getRiskTypesAsItems } from '../../../../client/store/selectors/riskTypes';
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
    userId: getUserId(state),
    users: getSortedUsersByFirstNameAsItems(state),
    guidelines: getRiskGuidelines(state),
    types: getRiskTypesAsItems(state),
    organizationId: getOrganizationId(state),
    standard: state.collections.standardsByIds[standardId],
    risks: getRisksLinkedToStandard(state, { standardId }),
  })),
  ui({
    state: {
      error: null,
      opened: null,
      isSaving: false,
    },
  }),
  withHandlers({
    onSave: ({
      organizationId,
      updateUI,
      standardId,
    }) => ({ onDelete, activeView, ...props }) => {
      updateUI('isSaving', true);
      const cb = (err, id) => {
        updateUI('isSaving', false);

        if (err) return updateUI('error', err.message);

        updateUI('error', null);

        // remove subcard from ui
        onDelete();

        updateUI('opened', id);
      };

      if (activeView === 0) {
        return saveNew({
          ...props,
          organizationId,
          standardId,
        }, cb);
      }

      return linkExisting({
        ...props,
        standardId,
      }, cb);
    },
  }),
)(RisksSubcard);
