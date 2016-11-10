import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { setIsFullScreenMode } from '/client/redux/actions/standardsActions';
import { setFilter } from '/client/redux/actions/globalActions';
import modal from '/imports/startup/client/mixins/modal';
import { StandardsHelp } from '/imports/api/help-messages';
import { getId } from '/imports/api/helpers';
import swal from '/imports/ui/utils/swal';
import { restore, remove } from '/imports/api/standards/methods';

export const onToggleScreenMode = props => e => {
  const $div = $(e.target).closest('.content-cards-inner');
  const offset = $div.offset();

  if (props.isFullScreenMode) {
    props.dispatch(setIsFullScreenMode(false));

    setTimeout(() => {
      const css = {
        position: 'inherit',
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: 'auto',
        transition: 'none',
      };

      $div.css(css);
    }, 150);
  } else {
    const css = {
      position: 'fixed',
      top: offset.top,
      right: $(window).width() - (offset.left + $div.outerWidth()),
      bottom: '0',
      left: offset.left,
    };
    $div.css(css);

    setTimeout(() => {
      // Safari workaround
      $div.css({ transition: 'all .15s linear' });

      props.dispatch(setIsFullScreenMode(true));
    }, 100);
  }
};

export const onModalOpen = props => () =>
  modal.modal.open({
    _title: props.names.headerNames.header,
    template: 'EditStandard',
    helpText: StandardsHelp.standard,
    _id: getId(props.standard),
  });

export const onDiscussionOpen = props => e => {}; // TODO: mobile


export const onRestore = ({
  standard: {
    _id,
    title,
    isDeleted,
  } = {},
  dispatch,
}) => () => {
  if (!isDeleted) return;

  const options = {
    text: `The standard "${title}" will be restored!`,
    confirmButtonText: 'Restore',
  };
  const cb = (err) => {
    if (err) swal.error(err);

    swal.success('Restored!', `The standard "${title}" was restored successfully.`);

    FlowRouter.setQueryParams({ filter: 1 });
    dispatch(setFilter(1));
    // TODO: redirect to that standard
  };

  swal(options, () => restore.call({ _id }, cb));
};

export const onDelete = ({
  standard: {
    _id,
    title,
    isDeleted,
  } = {},
}) => () => {
  if (!isDeleted) return;

  const options = {
    text: `The standard "${title}" will be deleted permanently!`,
    confirmButtonText: 'Delete',
  };
  const cb = (err) => {
    if (err) swal.error(err);

    swal.success('Deleted!', `The standard "${title}" was removed successfully.`);
    // TODO: redirect to the first standard
  };

  swal(options, () => remove.call({ _id }, cb));
};
