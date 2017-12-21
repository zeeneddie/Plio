import { compose, withHandlers, withProps, withState } from 'recompose';
import { connect } from 'react-redux';
import { propOr } from 'ramda';

import RisksSubcard from '../components/RisksSubcard';
import { insert, remove } from '../../../../api/risks/methods';
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
import { getStandardsAsItems } from '../../../../client/store/selectors/standards';

export default compose(
  withProps(() => ({ store })),
  connect((state, { standardId }) => ({
    userId: getUserId(state),
    users: getSortedUsersByFirstNameAsItems(state),
    guidelines: getRiskGuidelines(state),
    types: getRiskTypesAsItems(state),
    standards: getStandardsAsItems(state),
    organizationId: getOrganizationId(state),
    standard: state.collections.standardsByIds[standardId],
  })),
  withState('isSaving', 'setIsSaving', propOr(false, 'isSaving')),
  withHandlers({
    onSave: ({
      organizationId,
      setIsSaving,
      standardId,
    }) => ({
      title,
      description,
      originatorId,
      ownerId,
      magnitude,
      typeId,
      onDelete,
    }) => {
      setIsSaving(true);
      const methodArgs = {
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
      _modal_.modal.callMethod(insert, methodArgs, (err, res) => {
        setIsSaving(false);
        // remove subcard from ui
        onDelete();
      });
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
