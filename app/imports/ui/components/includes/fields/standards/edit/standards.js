import { Template } from 'meteor/templating';
import { invoke } from 'lodash';

import { Standards } from '/imports/api/standards/standards.js';

Template.Fields_Standards_Edit.viewmodel({
  mixin: ['organization', 'search', 'standard'],
  isEditable: true,
  standardsIds: [],
  isDeleteButtonVisible() {
    return !this._id || invoke(this.selected(), 'count') > 1;
  },
  selected() {
    const standardsIds = Array.from(this.standardsIds() || []);
    return this._getStandardsByQuery({ _id: { $in: standardsIds } });
  },
  value() {
    return invoke(this.child('Select_Multi'), 'value');
  },
  standards() {
    return this._getStandardsByQuery({ ...this.searchObject('value', [{ name: 'title' }, { name: 'status' }]) });
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selectedItemId, selected } = viewmodel.getData();
    if (this.areIdsIncludesItemId(selectedItemId)) return;

    this.callUpdate(selectedItemId, selected, '$addToSet');
  },
  callUpdate(selectedItemId, selected, option) {
    if (selected.length === 0 && this._id) {
      ViewModel.findOne('ModalWindow').setError('Link cannot be removed. There must be at least one Standard linked to this document.');
      return;
    }

    if (selected.length === this.selected().count() &&  selected.every(({ _id:itemId }) => this.selected().fetch().find(({ _id }) => _id === itemId))) return;

    const standardsIds = selected.map(({ _id }) => _id);

    this.standardsIds(standardsIds);

    if (!this._id) return;

    const options = {
      [`${option}`]: {
        standardsIds: selectedItemId
      }
    };

    this.parent().update({ options });
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    const { selectedItemId, selected } = viewmodel.getData();

    if (!this.areIdsIncludesItemId(selectedItemId)) return;

    this.callUpdate(selectedItemId, selected, '$pull');
  },
  areIdsIncludesItemId(selectedItemId) {
    return this.standardsIds().includes(selectedItemId);
  },
  getData() {
    const { standardsIds } = this.data();
    return { standardsIds };
  }
});
