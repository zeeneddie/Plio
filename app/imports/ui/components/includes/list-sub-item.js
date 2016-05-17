import { Template } from 'meteor/templating';

import { StandardTypes } from '/imports/api/standards-types/standards-types.js';

Template.ListSubItem.viewmodel({
  share: ['standard', 'window'],
  mixin: ['organization', 'standard'],
  standardType() {
    const typeId = this.typeId && this.typeId();
    return StandardTypes.findOne({ _id: typeId });
  },
  typeName() {
    return this.standardType() && this.standardType().name;
  },
  select() {
    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    const { serialNumber } = this.organization();

    this.selectedStandardId(this._id());

    FlowRouter.go(
      'standard',
      { orgSerialNumber: serialNumber, standardId: this._id() },
      { by: this.activeStandardFilter() }
    );
  }
});
