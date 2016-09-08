import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import {
  insert, update, remove
} from '/imports/api/non-conformities/methods.js';
import { getTzTargetDate } from '/imports/api/helpers.js';


Template.Subcards_NonConformities_Edit.viewmodel({
  mixin: ['addForm', 'nonconformity', 'organization', 'modal'],
  _query: {},
  isStandardsEditable: false,
  renderContentOnInitial() {
    return !(this.NCs().count() > 5);
  },
  NCs() {
    return this._getNCsByQuery({ ...this._query() }, { sort: { serialNumber: 1 } });
  },
  renderText({ sequentialId, title }) {
    return `<strong>${sequentialId}</strong> ${title}`;
  },
  addNC() {
    this.addForm(
      'Subcard',
      {
        content: 'NC_Create',
        isStandardsEditable: this.isStandardsEditable(),
        standardsIds: [invoke(this, '_id')],
        _lText: 'New non-conformity',
        isNew: false,
        insertFn: this.insert.bind(this),
        removeFn: this.remove.bind(this)
      }
    );
  },
  insertFn() {
    return this.insert.bind(this);
  },
  insert({ ...args }, cb) {
    const organizationId = this.organizationId();

    this.modal().callMethod(insert, { ...args, organizationId }, cb);
  },
  updateFn() {
    return this.update.bind(this);
  },
  update({ _id, ...args }, cb = () => {}) {
    this.modal().callMethod(update, { _id, ...args }, cb);
  },
  removeFn() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    if (!_id) {
      return viewmodel.destroy();
    } else {
      const { title } = viewmodel.getData();

      swal(
        {
          title: 'Are you sure?',
          text: `The non-conformity "${title}" will be removed.`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Remove',
          closeOnConfirm: false
        },
        () => {
          const cb = (err) => {
            if (err) {
              swal.close();
              return;
            }

            viewmodel.destroy();

            swal('Removed!', `The non-conformity "${title}" was removed successfully.`, 'success');
          };

          this.modal().callMethod(remove, { _id }, cb);
        }
      );
    }
  }
});
