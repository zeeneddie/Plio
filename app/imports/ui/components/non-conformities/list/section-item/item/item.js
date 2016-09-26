import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { Occurrences } from '/imports/share/collections/occurrences.js';
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
  _id: '',
  cost: '',
  currency: '',
  identifiedAt: '',
  identifiedBy: '',
  magnitude: '',
  sequentialId: '',
  status: '',
  title: '',
  viewedBy: [],
  linkArgs() {
    const _id = this._id();
    return {
      isActive: Object.is(this.NCId(), _id),
      onClick: handler => handler({ nonconformityId: _id }),
      href: (() => {
        const params = {
          nonconformityId: _id,
          orgSerialNumber: this.organizationSerialNumber()
        };
        const queryParams = { filter: this.activeNCFilterId() };
        return FlowRouter.path('nonconformity', params, queryParams);
      })()
    };
  },
  isNew() {
    //return !this.viewedBy().find(_id => _id === Meteor.userId());

    const filter = { _id: this._id() };
    const options = { fields: { createdAt: 1, viewedBy: 1 } };
    const doc = this._getNCByQuery(filter, options);
    const userId = Meteor.userId();

    return doc && this.isNewDoc({ doc, userId });
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
  }
});
