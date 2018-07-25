import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import {
  insert, update, remove,
} from '/imports/api/risks/methods';
import { getTzTargetDate } from '/imports/share/helpers';
import { inspire } from '/imports/api/helpers';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.Subcards_Risks_Edit.viewmodel({
  mixin: ['risk', 'organization', 'modal'],
  _query: {},
  isStandardsEditable: false,
  wrapperArgs() {
    const {
      risks,
      _id,
      isStandardsEditable,
    } = inspire([
      'risks',
      '_id',
      'isStandardsEditable',
    ], this);

    const items = risks.fetch();

    return {
      items,
      addText: 'Add a new risk',
      renderContentOnInitial: !(items.length > 5),
      _lText: 'Risks',
      _rText: items.length,
      onAdd: this.onAdd({ _id, isStandardsEditable }),
      getSubcardArgs: this.getSubcardArgs.bind(this),
    };
  },
  getSubcardArgs(doc) {
    return {
      doc,
      _id: doc._id,
      _lText: this.renderText(doc),
      content: 'Risk_Subcard',
      insertFn: this.insert.bind(this),
      updateFn: this.update.bind(this),
      removeFn: this.remove.bind(this),
    };
  },
  risks() {
    return this._getRisksByQuery({ ...this._query() }, { sort: { serialNumber: 1 } });
  },
  renderText({ sequentialId, title }) {
    return `<strong>${sequentialId}</strong> ${title}`;
  },
  onAdd({ _id, isStandardsEditable }) {
    return add => add(
      'Subcard',
      {
        isStandardsEditable,
        content: 'Risks_Create',
        standardsIds: [_id],
        _lText: 'New risk',
        isNew: false,
        insertFn: this.insert.bind(this),
        removeFn: this.remove.bind(this),
      },
    );
  },
  insert({ ...args }, cb) {
    const organizationId = this.organizationId();

    this.modal().callMethod(insert, { ...args, organizationId }, cb);
  },
  update({ _id, ...args }, cb = () => {}) {
    this.modal().callMethod(update, { _id, ...args }, cb);
  },
  remove(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    if (!_id) {
      return viewmodel.destroy();
    }
    const { title } = viewmodel.getData();

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

        viewmodel.destroy();

        swal({
          title: 'Removed!',
          text: `The risk "${title}" was removed successfully.`,
          type: 'success',
          timer: ALERT_AUTOHIDE_TIME,
          showConfirmButton: false,
        });
      };

      this.modal().callMethod(remove, { _id }, cb);
    });
  },
});
