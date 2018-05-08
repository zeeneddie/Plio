import { Meteor } from 'meteor/meteor';

import modal from '/imports/startup/client/mixins/modal';
import { RisksHelp } from '/imports/api/help-messages';
import swal from '/imports/ui/utils/swal';
import { restore, remove } from '/imports/api/risks/methods';
import { isOrgOwner } from '/imports/api/checkers';
import { RiskFilterIndexes } from '/imports/api/constants';
import { goTo } from '../../../../utils/router/actions';

export const onModalOpen = ({ _id }) => () =>
  modal.modal.open({
    _id,
    _title: 'Risk',
    template: 'Risks_Card_Edit',
    helpText: RisksHelp.risk,
  });


export const onRestore = ({
  _id,
  title,
  isDeleted,
}) => () => {
  if (!isDeleted) return;

  const options = {
    text: `The risk "${title}" will be restored!`,
    confirmButtonText: 'Restore',
  };
  const cb = (err) => {
    if (err) swal.error(err);

    swal.success('Restored!', `The risk "${title}" was restored successfully.`);

    const params = { urlItemId: _id };
    const queryParams = { filter: RiskFilterIndexes.TYPE };

    Meteor.defer(() => goTo('risk')(params, queryParams));
  };

  swal(options, () => restore.call({ _id }, cb));
};

export const onDelete = ({
  _id,
  title,
  isDeleted,
  userId,
  organizationId,
}) => () => {
  if (!isDeleted || !isOrgOwner(userId, organizationId)) return;

  const options = {
    text: `The risk "${title}" will be deleted permanently!`,
    confirmButtonText: 'Delete',
  };
  const cb = (err) => {
    if (err) swal.error(err);

    swal.success('Deleted!', `The risk "${title}" was removed successfully.`);
  };

  swal(options, () => remove.call({ _id }, cb));
};
