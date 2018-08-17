import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { LessonsLearned } from '/imports/share/collections/lessons.js';
import { insert, update, remove } from '/imports/api/lessons/methods.js';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

const getLinks = instance => instance.data(['linkedTo', 'linkedToId']);

Template.Subcards_LessonsLearned_Edit.viewmodel({
  mixin: ['modal', 'organization'],
  documentId: '',
  documentType: '',
  linkedTo: '',
  linkedToId: '',
  wrapperArgs() {
    const items = invoke(this.lessons(), 'fetch');

    return {
      items,
      addText: 'Add a new lesson learned',
      renderContentOnInitial: !(items.length > 10),
      _lText: 'Lessons learned',
      _rText: items.length,
      onAdd: this.onAdd.bind(this),
      getSubcardArgs: this.getSubcardArgs.bind(this),
    };
  },
  getSubcardArgs(doc) {
    return {
      doc,
      ...doc,
      ...getLinks(this),
      _lText: this.renderText(doc),
      content: 'Subcards_LessonLearned',
      insertFn: this.insert.bind(this),
      updateFn: this.update.bind(this),
      removeFn: this.remove.bind(this),
    };
  },
  renderText({ title, serialNumber }) {
    return `<strong>LL${serialNumber}</strong> ${title}`;
  },
  lessons() {
    const documentId = this.documentId();
    const query = { documentId };
    const options = { sort: { serialNumber: 1 } };
    return LessonsLearned.find(query, options);
  },
  onAdd(add) {
    return add(
      'Subcard',
      {
        content: 'Subcards_LessonLearned',
        _lText: 'New lesson learned',
        isNew: false,
        ...getLinks(this),
        insertFn: this.insert.bind(this),
        updateFn: this.update.bind(this),
        removeFn: this.remove.bind(this),
      },
    );
  },
  insert({ ...args }, cb) {
    const organizationId = this.organizationId();
    const { documentId, documentType } = this.data();

    this.modal().callMethod(insert, {
      organizationId, documentId, documentType, ...args,
    }, cb);
  },
  update({ ...args }, cb) {
    this.modal().callMethod(update, { ...args }, cb);
  },
  remove(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    const { title } = viewmodel.getData();

    if (!_id) {
      return viewmodel.destroy();
    }
    swal({
      title: 'Are you sure?',
      text: `The lesson "${title}" will be removed.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: false,
    }, () => {
      const cb = () => {
        viewmodel.destroy();
        swal({
          title: 'Removed!',
          text: `The lesson "${title}" was removed successfully.`,
          type: 'success',
          timer: ALERT_AUTOHIDE_TIME,
          showConfirmButton: false,
        });
      };

      this.modal().callMethod(remove, { _id }, cb);
    });
  },
});
