import { Template } from 'meteor/templating';

import { Occurences } from '/imports/api/occurences/occurences.js';

import { insert, update, remove } from '/imports/api/occurences/methods.js';

Template.NCOccurences.viewmodel({
  mixin: ['collapse', 'addForm', 'modal', 'date'],
  autorun() {
    const _id = this._id && this._id();
    this.templateInstance.subscribe('occurences', _id);
  },
  occurencesIds: [],
  occurences() {
    const query = ((() => {
      const nonConformityId = this._id && this._id();
      return { nonConformityId };
    })());
    const options = { sort: { serialNumber: 1 } };
    return Occurences.find(query, options);
  },
  addOccurence() {
    this.addForm(
      'SubCardEdit',
      {
        _lText: '',
        _rText: '',
        content: 'NCOccurencesSubCardContent',
        onSave: this.save.bind(this),
        onDelete: this.remove.bind(this)
      }
    );
  },
  onSaveCb() {
    return this.save.bind(this);
  },
  save(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    const { date, description } = viewmodel.getData();

    if (!_id) {
      this.insert(viewmodel, { date, description });
    } else {
      this.update(viewmodel, { _id, date, description });
    }
  },
  insert(viewmodel, { date, description }) {
    const nonConformityId = this._id && this._id();
    const cb = () => viewmodel.destroy();

    this.modal().callMethod(insert, { nonConformityId, date, description }, cb);
  },
  update(viewmodel, { _id, date, description }) {
    const context = this.templateInstance.data;

    if (date === context['date'] && description === context['description']) return;

    const cb = () => viewmodel.toggleCollapse();

    this.modal().callMethod(update, { _id, date, description }, cb);
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    if (!_id) {
      viewmodel.destroy();
    } else {
      this.modal().callMethod(remove, { _id });
    }
  }
});
