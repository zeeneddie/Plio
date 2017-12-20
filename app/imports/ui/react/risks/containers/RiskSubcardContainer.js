import { withHandlers } from 'recompose';

import RiskSubcard from '../components/RiskSubcard';

import { insert, remove } from '../../../../api/risks/methods';
import _modal_ from '../../../../startup/client/mixins/modal';
import { swal } from '../../../utils';
import { ALERT_AUTOHIDE_TIME } from '../../../../api/constants';

export default withHandlers({
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
})(RiskSubcard);
