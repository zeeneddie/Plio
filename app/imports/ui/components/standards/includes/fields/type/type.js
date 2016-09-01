import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ViewModel } from 'meteor/manuel:viewmodel';
import get from 'lodash.get';

import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { DefaultStandardTypes } from '/imports/api/constants.js';

Template.ESType.viewmodel({
  share: 'standard',
  mixin: ['organization', 'collapsing', 'standard'],
  autorun() {
    // to fix bug wich randomly calls method
    if (this.typeId() !== this.templateInstance.data.typeId) {
      Tracker.nonreactive(() => this.update());
    }
  },
  typeId() {
    const organizationId = this.organizationId();
    const data = DefaultStandardTypes.find(({ abbreviation } = {}) => Object.is(abbreviation, 'POL')); // Policy
    const type = StandardTypes.findOne({ organizationId, ...type }) || _.first(this.types());
    return get(type, '_id');
  },
  types() {
    const organizationId = this.organizationId();
    const types = StandardTypes.find({ organizationId }).fetch();
    return types;
  },
  update() {
    if (!this._id) return;

    const { typeId } = this.getData();
    const modal = ViewModel.findOne('ModalWindow');

    if (!typeId) {
      modal.setError('Type is required!');
    }

    this.parent().update({ typeId }, (err) => {
      Tracker.flush();
      this.expandCollapsed(this.standardId());
    });
  },
  getData() {
    const { typeId } = this.data();
    return { typeId };
  }
});
