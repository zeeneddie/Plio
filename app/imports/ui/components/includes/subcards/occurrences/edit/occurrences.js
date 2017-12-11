import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { Occurrences } from '/imports/share/collections/occurrences.js';
import { insert, update, remove } from '/imports/api/occurrences/methods.js';
import { invokeId } from '/imports/api/helpers';
import { NonConformitiesHelp } from '/imports/api/help-messages.js';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.Subcards_Occurrences_Edit.viewmodel({
  mixin: ['modal', 'date', 'organization', 'nonconformity'],
  wrapperArgs() {
    const items = invoke(this.occurrences(), 'fetch');

    return {
      items,
      addText: 'Add a new occurrence',
      renderContentOnInitial: !(items.length > 15),
      _lText: 'Occurrences',
      _rText: items.length,
      onAdd: this.onAdd.bind(this),
      getSubcardArgs: this.getSubcardArgs.bind(this),
    };
  },
  getSubcardArgs(doc) {
    return {
      doc,
      ...doc,
      _lText: this.renderText(doc),
      _rText: this.renderDate(doc.date),
      content: 'Subcards_Occurrence',
      insertFn: this.insert.bind(this),
      updateFn: this.update.bind(this),
      removeFn: this.remove.bind(this),
    };
  },
  renderText({ sequentialId }) {
    return `<strong>${sequentialId}</strong>`;
  },
  nonConformity() {
    return this._getNCByQuery({ _id: invokeId(this) });
  },
  occurrences() {
    const query = { nonConformityId: invokeId(this) };
    const options = { sort: { serialNumber: 1 } };
    return Occurrences.find(query, options);
  },
  onAdd(add) {
    const { sequentialId } = Object.assign({}, this.nonConformity());

    return add(
      'Subcard',
      {
        content: 'Subcards_Occurrence',
        _lText: `${sequentialId}-new occurrence`,
        isNew: false,
        insertFn: this.insert.bind(this),
        updateFn: this.update.bind(this),
        removeFn: this.remove.bind(this),
      },
    );
  },
  insert({ ...args }, cb) {
    const nonConformityId = invokeId(this);
    this.modal().callMethod(insert, { nonConformityId, ...args }, cb);
  },
  update({ ...args }, cb) {
    this.modal().callMethod(update, { ...args }, cb);
  },
  remove(viewmodel) {
    const _id = invokeId(viewmodel);

    if (!_id) {
      viewmodel.destroy();
    } else {
      const seq = invoke(viewmodel, 'sequentialId');
      swal({
        title: 'Are you sure?',
        text: `The occurrence "${seq}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false,
      }, () => {
        const cb = (err) => {
          if (!err) {
            swal({
              title: 'Removed!',
              text: `The occurrence "${seq}" was removed successfully.`,
              type: 'success',
              timer: ALERT_AUTOHIDE_TIME,
              showConfirmButton: false,
            });
          }
        };

        this.modal().callMethod(remove, { _id }, cb);
      });
    }
  },
});
