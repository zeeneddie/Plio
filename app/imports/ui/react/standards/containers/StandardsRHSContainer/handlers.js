import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import modal from '/imports/startup/client/mixins/modal';
import { StandardsHelp } from '/imports/api/help-messages';
import { getId } from '/imports/api/helpers';
import swal from '/imports/ui/utils/swal';
import { restore, remove } from '/imports/api/standards/methods';
import { isOrgOwner } from '/imports/api/checkers';
import { STANDARD_FILTER_MAP, ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

export const onModalOpen = props => () =>
  modal.modal.open({
    _title: props.names.headerNames.header,
    template: 'EditStandard',
    helpText: StandardsHelp.standard,
    _id: getId(props.standard),
  });


export const onRestore = ({
  standard: {
    _id,
    title,
    isDeleted,
  } = {},
}) => () => {
  if (!isDeleted) return;

  const options = {
    text: `The standard "${title}" will be restored!`,
    confirmButtonText: 'Restore',
  };
  const cb = (err) => {
    if (err) swal.error(err);

    swal.success({
      title: 'Restored!',
      text: `The standard "${title}" was restored successfully.`,
      type: 'success',
      timer: ALERT_AUTOHIDE_TIME,
      showConfirmButton: false,
    });

    const params = { orgSerialNumber: FlowRouter.getParam('orgSerialNumber'), urlItemId: _id };
    const queryParams = { filter: STANDARD_FILTER_MAP.SECTION };

    Meteor.setTimeout(() => FlowRouter.go('standard', params, queryParams), 0);
  };

  swal(options, () => restore.call({ _id }, cb));
};

export const onDelete = ({
  standard: {
    _id,
    title,
    isDeleted,
  } = {},
  userId,
  organizationId,
}) => () => {
  if (!isDeleted || !isOrgOwner(userId, organizationId)) return;

  const options = {
    text: `The standard "${title}" will be deleted permanently!`,
    confirmButtonText: 'Delete',
  };
  const cb = (err) => {
    if (err) swal.error(err);

    swal.success('Deleted!', `The standard "${title}" was removed successfully.`);
  };

  swal(options, () => remove.call({ _id }, cb));
};
