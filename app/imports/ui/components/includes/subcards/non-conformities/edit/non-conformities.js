import { Template } from 'meteor/templating';
import { insert, update, remove } from '/imports/api/non-conformities/methods.js';

Template.Subcards_NonConformities_Edit.viewmodel({
  mixin: ['addForm', 'nonconformity', 'organization', 'modal'],
  _query: {},
  _args: {},
  NCs() {
    return this._getNCsByQuery({ ...this._query() });
  },
  renderText({ sequentialId, title }) {
    return `<strong>${sequentialId}</strong> ${title}`;
  },
  addNC() {
    this.addForm(
      'SubCardEdit',
      {
        content: 'CreateNC',
        insertFn: this.insert.bind(this),
        removeFn: this.remove.bind(this)
      }
    );
  },
  insertFn() {
    return this.insert.bind(this);
  },
  insert({ title, identifiedAt, identifiedBy, magnitude }) {
    const organizationId = this.organizationId();

    const cb = (err, _id) => {
      const newNCSubcard = ViewModel.findOne('SubCardEdit', vm => vm._id && vm._id() === _id);
      newNCSubcard && newNCSubcard.toggleCollapse();
    };

    this.modal().callMethod(insert, { title, identifiedAt, identifiedBy, magnitude, organizationId, ...this._args() }, cb);
  },
  updateFn() {
    return this.update.bind(this);
  },
  update({ query = {}, options = {}, ...args }, cb = () => {}) {
    console.log(query, options, args)
    // const _id = this._id();
    // const organizationId = this.organizationId();
    // const arguments = { ...args, _id, options, query, organizationId };
    //
    // console.log(arguments);
    //
    // this.modal().callMethod(update, arguments, cb);
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
          const cb = () => {
            viewmodel.destroy();
            swal('Removed!', `The non-conformity "${title}" was removed successfully.`, 'success');
          };

          this.modal().callMethod(remove, { _id }, cb);
        }
      );
    }
  },
});
