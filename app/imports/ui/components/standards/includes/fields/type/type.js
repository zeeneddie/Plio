import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ViewModel } from 'meteor/manuel:viewmodel';
import cx from 'classnames';
import { lenses, getId } from 'plio-util';
import { view, propEq, find, either, compose } from 'ramda';

import { StandardTypes } from '../../../../../../share/collections';
import { sortArrayByTitlePrefix } from '../../../../../../api/helpers';
import { DefaultStandardTypes } from '../../../../../../share/constants';

// this will only work if the organization hasn't removed/changed
// the default Standard operating procedure type
const getDefaultType = find(propEq(
  'titlePrefix',
  DefaultStandardTypes.STANDARD_OPERATING_PROCEDURE.title,
));
const getDefaultTypeId = either(
  compose(getId, getDefaultType),
  view(lenses.head._id),
);

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
      const typeId = getDefaultTypeId(Object.assign([], this.types()));
      if (typeId) this.typeId(typeId);
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

    this.parent().update({ typeId }, () => {
      this.expandCollapsed(this.standardId());
    });
  },
  getData() {
    const { typeId } = this.data();
    return { typeId: typeId || this.typeId() };
  },
});
