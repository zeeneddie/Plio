import { Template } from 'meteor/templating';

import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';

Template.ListSubItem.viewmodel({
  share: 'standard',
  standardType() {
    const typeId = this.type && this.type();
    return StandardsTypes.findOne({ _id: typeId });
  },
  typeName() {
    return this.standardType() && this.standardType().name;
  },
  select() {
    if ($(window).width() < 768) {
      $('.content-list').attr('style', 'display: none !important');
      $('.content-cards').attr('style', 'display: block !important');
    }
    this.selectedStandardId(this._id());
  },
  renderNumber() {
    return this.number && `${this.parent().number()}.${this.number() && this.number().join('.')}`;
  }
});
