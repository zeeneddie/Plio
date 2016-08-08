import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import { updateViewedBy } from '/imports/api/non-conformities/methods.js';

Template.NC_Item.viewmodel({
  share: 'window',
  mixin: ['date', 'nonconformity', 'currency', 'organization'],
  onCreated(template) {
    const currency = this.organization() && this.organization().currency;
    this.load({ currency });

    template.autorun((computation) => {
      if (this._id() === this.NCId() && this.isNew()) {
        Tracker.nonreactive(() => this.updateViewedBy(() => computation.stop()));
      }
    });
  },
  cost: '',
  currency: '',
  identifiedAt: '',
  identifiedBy: '',
  magnitude: '',
  sequentialId: '',
  status: '',
  title: '',
  viewedBy: [],
  isNew() {
    return !this.viewedBy().find(_id => _id === Meteor.userId());
  },
  renderTitle() {
    const count = this.occurrences().count();
    const title = this.title();
    return count > 0 ? `${title} (x ${count})` : title;
  },
  occurrences() {
    const query = { nonConformityId: this._id && this._id() };
    return Occurrences.find(query);
  },
  totalCost() {
    const symbol = this.getCurrencySymbol(this.currency());
    const count = this.occurrences().count();

    if (!this.cost()) return symbol + 0;

    return symbol + count * this.cost();
  },
  updateViewedBy() {
    const _id = this._id();

    updateViewedBy.call({ _id });
  },
  navigate() {
    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.setParams({ nonconformityId: this._id() });
  }
});
