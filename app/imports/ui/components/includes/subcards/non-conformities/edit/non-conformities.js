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
        insertFn: this.insert.bind(this)
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
  }
});
