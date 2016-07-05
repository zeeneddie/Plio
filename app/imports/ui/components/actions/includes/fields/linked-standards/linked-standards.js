import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { Standards } from '/imports/api/standards/standards.js';

Template.Actions_LinkedStandards.viewmodel({
  mixin: ['search', 'organization'],
  standardsIds: [],
  isEditable: true,
  standardsIdsArray() {
    return Array.from(this.standardsIds() || []);
  },
  standardSearchText() {
    const child = this.child('SelectItem');
    return child && child.value();
  },
  standards() {
    const ids = this.standardsIdsArray();
    const query = {
      ...this.searchObject('standardSearchText', 'title'),
      organizationId: this.organizationId(),
      _id: { $nin: ids }
    };

    return Standards.find(query, { sort: { title: 1 } }).fetch();
  },
  linkedStandards() {
    const ids = this.standardsIdsArray();
    const query = { _id: { $in: ids }, organizationId: this.organizationId() };
    return Standards.find(query, { sort: { title: 1 } });
  },
  onSelectCb() {
    return this.onSelect.bind(this);
  },
  onSelect(viewmodel) {
    const { selected:standardId } = viewmodel.getData();

    if (this.standardsIdsArray().find(id => id === standardId)) return;

    this.onLink(standardId, () => {
      viewmodel.value('');
      viewmodel.selected('');
    });
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(e) {
    const { _id } = Blaze.getData(e.target);

    if (!this.standardsIdsArray().find(id => id === _id)) return;

    this.onUnlink(_id);
  }
});
