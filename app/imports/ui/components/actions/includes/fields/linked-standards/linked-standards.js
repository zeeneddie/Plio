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

    if (this.onLink) {
      this.onLink({ standardId }, () => {
        viewmodel.value('');
        viewmodel.selected('');
      });
    } else {
      this.standardIds().push(standardId);
    }
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(e) {
    const { _id:standardId } = Blaze.getData(e.target);

    if (!this.standardsIdsArray().find(id => id === standardId)) return;

    if (this.onUnlink) {
      this.onUnlink({ standardId });
    } else {
      this.standardsIds().remove(id => id === standardId);
    }
  },
  getData() {
    return { linkedStandardsIds: this.standardsIds().array() };
  }
});
