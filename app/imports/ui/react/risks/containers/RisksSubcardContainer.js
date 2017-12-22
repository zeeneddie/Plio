import { compose, withHandlers, withContext, withState } from 'recompose';
import { connect } from 'react-redux';
import { propOr } from 'ramda';
import ui from 'redux-ui';
import { PropTypes } from 'react';

import RisksSubcard from '../components/RisksSubcard';
import { insert, remove, linkStandard } from '../../../../api/risks/methods';
import _modal_ from '../../../../startup/client/mixins/modal';
import { swal } from '../../../utils';
import { ALERT_AUTOHIDE_TIME } from '../../../../api/constants';
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

const saveNewDoc = ({
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
  // TEMP
  // because edit modal is still in blaze
  return _modal_.modal.callMethod(insert, args, cb);
};

const updateExistingDoc = ({ riskId: _id, standardId }, cb) => {
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
  })),
  ui({
    state: {
      error: null,
    },
  }),
  withState('isSaving', 'setIsSaving', propOr(false, 'isSaving')),
  withHandlers({
    onSave: ({
      organizationId,
      setIsSaving,
      standardId,
      active,
    }) => ({ onDelete, ...props }) => {
      setIsSaving(true);
      const cb = (err, id) => {
        setIsSaving(false);
        // remove subcard from ui
        onDelete();
      };

      if (active === 0) {
        return saveNewDoc({
          ...props,
          organizationId,
          standardId,
        }, cb);
      }

      return updateExistingDoc({
        ...props,
        standardId,
      }, cb);
    },
    onDelete: ({ setIsSaving }) => ({ risk: { _id, title } }) => {
      swal({
        title: 'Are you sure?',
        text: `The risk "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false,
      }, () => {
        setIsSaving(true);

        const cb = (err) => {
          setIsSaving(false);
          if (err) {
            swal.close();
            return;
          }

          swal({
            title: 'Removed!',
            text: `The risk "${title}" was removed successfully.`,
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        };

        // TEMP
        // because edit modal is still in blaze
        _modal_.modal.callMethod(remove, { _id }, cb);
      });
    },
  }),
)(RisksSubcard);
