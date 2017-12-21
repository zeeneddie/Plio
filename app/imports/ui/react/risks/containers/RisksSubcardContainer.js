import { compose, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';

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
import { getRiskGuidelines } from '../../../../client/store/selectors/organizations/index';
import { getRiskTypesAsItems } from '../../../../client/store/selectors/riskTypes';
import { getStandardsAsItems } from '../../../../client/store/selectors/standards';

export default compose(
  withProps(() => ({ store })),
  connect(state => ({
    userId: getUserId(state),
    users: getSortedUsersByFirstNameAsItems(state),
    guidelines: getRiskGuidelines(state),
    types: getRiskTypesAsItems(state),
    standards: getStandardsAsItems(state),
  })),
  withHandlers({
    onSave: () => (args, cb) => {
      console.log(args, cb);
    },
    onDelete: () => ({ risk: { _id, title } }) => {
      swal({
        title: 'Are you sure?',
        text: `The risk "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false,
      }, () => {
        const cb = (err) => {
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
