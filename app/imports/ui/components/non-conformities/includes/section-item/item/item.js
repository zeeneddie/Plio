import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Occurences } from '/imports/api/occurences/occurences.js';

Template.NCItem.viewmodel({
  share: 'window',
  mixin: ['date', 'nonconformity', 'currency', 'organization'],
  onCreated() {
    const currency = this.organization() && this.organization().currency;
    this.load({ currency });
  },
  cost: '',
  currency: '',
  identifiedAt: '',
  identifiedBy: '',
  magnitude: '',
  sequentialId: '',
  status: '',
  title: '',
  renderTitle() {
    const count = this.occurences().count();
    const title = this.title();
    return count > 0 ? `${title} (x ${count})` : title;
  },
  occurences() {
    const query = { nonConformityId: this._id && this._id() };
    return Occurences.find(query);
  },
  totalCost() {
    const symbol = this.getCurrencySymbol(this.currency());
    const count = this.occurences().count();

    if (!this.cost()) return symbol + 0;

    return symbol + count * this.cost();
  },
  navigate() {
    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.setParams({ nonconformityId: this._id() });
  }
});
