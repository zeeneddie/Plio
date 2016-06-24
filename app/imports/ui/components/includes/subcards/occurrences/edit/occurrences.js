import { Template } from 'meteor/templating';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';

import { insert, update, remove } from '/imports/api/occurrences/methods.js';

Template.Subcards_Occurrences_Edit.viewmodel({
  mixin: ['collapse', 'addForm', 'modal', 'date'],
  renderText({ sequentialId }) {
    return `<strong>${sequentialId}</strong>`;
  },
  occurrences() {
    const query = ((() => {
      const nonConformityId = this._id && this._id();
      return { nonConformityId };
    })());
    const options = { sort: { serialNumber: 1 } };
    return Occurrences.find(query, options);
  },
  addOccurrence() {
    this.addForm(
      'SubCardEdit',
      {
        _lText: '',
        _rText: '',
        content: 'Subcards_Occurrence',
        insertFn: this.insertFn(),
        removeFn: this.removeFn(),
        updateFn: this.updateFn()
      }
    );
  },
  insertFn() {
    return this.insert.bind(this);
  },
  insert({ ...args }, cb) {
    const nonConformityId = this._id && this._id();
    this.modal().callMethod(insert, { nonConformityId, ...args }, cb);
  },
  updateFn() {
    return this.update.bind(this);
  },
  update({ ...args }, cb) {
    this.modal().callMethod(update, { ...args }, cb);
  },
  removeFn() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    if (!_id) {
      viewmodel.destroy();
    } else {
      const seq = viewmodel.sequentialId && viewmodel.sequentialId();
      swal(
        {
          title: 'Are you sure?',
          text: `The occurrence "${seq}" will be removed.`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Remove',
          closeOnConfirm: false
        },
        () => {
          const cb = (err) => {
            if (!err) {
              swal('Removed!', `The occurrence "${seq}" was removed successfully.`, 'success')
            }
          };

          this.modal().callMethod(remove, { _id }, cb);
        }
      );
    }
  }
});
