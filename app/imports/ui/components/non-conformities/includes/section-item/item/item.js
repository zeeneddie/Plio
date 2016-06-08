import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Occurences } from '/imports/api/occurences/occurences.js';

Template.NCItem.viewmodel({
  share: 'window',
  mixin: ['date', 'nonconformity', 'currency'],
  cost: '',
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
    if (!this.cost()) return 0;

    const { currency, value } = this.cost();
    const symbol = this.getCurrencySymbol(currency);
    const count = this.occurences().count();
    return symbol + count * value;
  },
  navigate() {
    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.setParams({ nonconformityId: this._id() });
  }
});
