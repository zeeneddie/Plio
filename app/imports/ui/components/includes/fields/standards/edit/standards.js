import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { sortArrayByTitlePrefix } from '/imports/api/helpers';


Template.Fields_Standards_Edit.viewmodel({
  mixin: ['organization', 'search', 'standard'],
  isEditable: true,
  standardsIds: [],
  selected() {
    const standardsIds = Array.from(this.standardsIds() || []);
    return this._getStandardsByQuery({ _id: { $in: standardsIds } });
  },
  value() {
    return invoke(this.child('Select_Multi'), 'value');
  },
  standards() {
    const standards = this._getStandardsByQuery({
      ...this.searchObject('value', [{ name: 'title' }, { name: 'status' }]),
    }).fetch();
    return sortArrayByTitlePrefix(standards);
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
    if (selected.length === this.selected().count() &&
        selected.every(({ _id: itemId }) =>
          this.selected().fetch().find(({ _id }) => _id === itemId))
    ) return;

    const standardsIds = selected.map(({ _id }) => _id);

    this.standardsIds(standardsIds);

    if (!this._id) return;

    const options = {
      [`${option}`]: {
        standardsIds: selectedItemId,
      },
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
    const standardsIds = this.standardsIds() || [];
    return standardsIds.includes(selectedItemId);
  },
  getData() {
    const { standardsIds } = this.data();
    return { standardsIds };
  },
});
