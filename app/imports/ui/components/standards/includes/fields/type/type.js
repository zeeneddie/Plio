import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ViewModel } from 'meteor/manuel:viewmodel';
import cx from 'classnames';

import { StandardTypes } from '/imports/share/collections/standards-types.js';
import { sortArrayByTitlePrefix } from '/imports/api/helpers.js';

Template.ESType.viewmodel({
  share: 'standard',
  mixin: ['organization', 'collapsing', 'standard'],
  typeId: '',
  autorun() {
    // to fix bug wich randomly calls method
    if (this.typeId() !== this.templateInstance.data.typeId) {
      Tracker.nonreactive(() => this.update());
    }
  },
  onCreated() {
    if (!this.typeId()) {
      const defaultType = _.first(Object.assign([], this.types()));
      defaultType && this.typeId(defaultType._id);
    }
  },
  types() {
    const organizationId = this.organizationId();
    const types = StandardTypes.find({ organizationId }).fetch().map(item => ({
      ...item,
      title: cx(item.title, item.abbreviation && `(${item.abbreviation})`),
      titlePrefix: item.title,
    }));

    return sortArrayByTitlePrefix(types);
  },
  update() {
    if (!this._id) return;

    const { typeId } = this.getData();
    const modal = ViewModel.findOne('ModalWindow');

    if (!typeId) {
      modal.setError('Type is required!');
    }

    this.parent().update({ typeId }, (err) => {
      this.expandCollapsed(this.standardId());
    });
  },
  getData() {
    const { typeId } = this.data();
    return { typeId: typeId || this.typeId() };
  },
});
