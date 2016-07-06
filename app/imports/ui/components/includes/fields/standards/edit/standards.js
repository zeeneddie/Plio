import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.Fields_Standards_Edit.viewmodel({
  mixin: ['organization', 'search', 'standard'],
  isEditable: true,
  standardsIds: [],
  selected() {
    const standardsIds = Array.from(this.standardsIds() || []);
    return this._getStandardsByQuery({ _id: { $in: standardsIds } });
  },
  value() {
    const child = this.child('Select_Multi');
    return !!child && child.value();
  },
  standards() {
    return this._getStandardsByQuery({ ...this.searchObject('value', [{ name: 'title' }, { name: 'status' }]) });
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected = [] } = viewmodel.getData();

    if (selected.length === 0 && this._id) {
      ViewModel.findOne('ModalWindow').setError('Link cannot be removed. There must be at least one Standard linked to this document.');
      viewmodel.selected(this.selected());
      return;
    }

    if (selected.length === this.selected().count() &&  selected.every(({ _id:itemId }) => this.selected().fetch().find(({ _id }) => _id === itemId))) return;

    const standardsIds = selected.map(({ _id }) => _id);

    this.standardsIds(standardsIds);

    if (!this._id) return;

    this.parent().update({ standardsIds })
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    this.update(viewmodel);
  },
  getData() {
    const { standardsIds } = this.data();
    return { standardsIds };
  }
});
