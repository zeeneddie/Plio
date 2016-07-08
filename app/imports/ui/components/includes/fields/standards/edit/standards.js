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
  update(viewmodel, option = '$addToSet') {
    const { selected = [], selectedItemId } = viewmodel.getData();

    if (selected.length === 0 && this._id) {
      ViewModel.findOne('ModalWindow').setError('A document must be linked to at least one standard.');
      viewmodel.selected(this.selected());
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
    this.updateOnParent(options);
  },
  updateOnParent(options) {
    if(options['$addToSet']) {
      if(this.standardsIds().includes(options['$addToSet'].standardsIds)) return;
    } else if(options['$pull']) {
      if(!this.standardsIds().includes(options['$pull'].standardsIds)) return;
    }

    this.parent().update({ options });
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    this.update(viewmodel, '$pull');
  },
  getData() {
    const { standardsIds } = this.data();
    return { standardsIds };
  }
});
