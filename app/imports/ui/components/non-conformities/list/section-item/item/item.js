import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Occurrences } from '/imports/share/collections/occurrences.js';
import { updateViewedBy } from '/imports/api/non-conformities/methods';

Template.NC_Item.viewmodel({
  share: 'window',
  mixin: ['date', 'user', 'nonconformity', 'currency', 'organization', 'problemsStatus', {
    counter: 'counter',
  }],
  onCreated(template) {
    const currency = this.organization() && this.organization().currency;
    this.load({ currency });

    template.autorun((computation) => {
      if (this._id() === this.NCId() && this.isNew()) {
        Tracker.nonreactive(() => this.updateViewedBy(() => computation.stop()));
      }
    });

    template.autorun(() => {
      const _id = this._id();

      if (!_id) return;

      template.subscribe('messagesNotViewedCount', `nc-messages-not-viewed-count-${_id}`, _id);
    });
  },
  _id: '',
  cost: '',
  currency: '',
  magnitude: '',
  sequentialId: '',
  status: '',
  title: '',
  viewedBy: [],
  linkArgs() {
    const _id = this._id();
    return {
      isActive: Object.is(this.NCId(), _id),
      onClick: handler => handler({ urlItemId: _id }),
      href: (() => {
        const params = {
          urlItemId: _id,
          orgSerialNumber: this.organizationSerialNumber(),
        };
        const queryParams = { filter: this.activeNCFilterId() };
        return FlowRouter.path('nonconformity', params, queryParams);
      })(),
    };
  },
  isNew() {
    const userId = Meteor.userId();

    return this.isNewDoc({ userId, doc: this.data() });
  },
  renderTitle() {
    const count = this.occurrences().count();
    const title = this.title();
    return count > 0 ? `${title} (x ${count})` : title;
  },
  getDate({ createdAt, deletedAt, isDeleted }) {
    return isDeleted ? this.renderDate(deletedAt) : this.renderDate(createdAt);
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
  getUserText({ isDeleted, deletedBy }) {
    return isDeleted
      ? `Deleted by: ${this.userNameOrEmail(deletedBy)}`
      : '';
  },
  unreadMessagesCount() {
    return this.counter.get(`nc-messages-not-viewed-count-${this._id()}`);
  },
  updateViewedBy() {
    const _id = this._id();

    Meteor.defer(() => updateViewedBy.call({ _id }));
  },
});
