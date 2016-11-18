import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { updateViewedBy } from '/imports/api/risks/methods.js';

Template.Risks_Item.viewmodel({
  share: 'window',
  mixin: ['risk', 'date', 'riskScore', 'organization', 'problemsStatus', {
    counter: 'counter'
  }],
  onCreated(template) {
    template.autorun((computation) => {
      if (this._id() === this.riskId() && this.isNew()) {
        Tracker.nonreactive(() => this.updateViewedBy(() => computation.stop()));
      }
    });

    template.autorun(() => {
      const _id = this._id();

      if (!_id) return;

      template.subscribe('messagesNotViewedCount', 'risk-messages-not-viewed-count-' + _id, _id);
    });
  },
  _id: '',
  identifiedAt: '',
  identifiedBy: '',
  magnitude: '',
  sequentialId: '',
  type: '',
  status: '',
  scores: '',
  title: '',
  primaryScore: '',
  viewedBy: [],
  primaryScore() {
    const scoresSorted = this.sortScores(this.scores(), -1);
    return this.getPrimaryScore(scoresSorted);
  },
  linkArgs() {
    const _id = this._id();
    return {
      isActive: Object.is(this.riskId(), _id),
      onClick: handler => handler({ riskId: _id }),
      href: (() => {
        const params = {
          riskId: _id,
          orgSerialNumber: this.organizationSerialNumber()
        };
        const queryParams = { filter: this.activeRiskFilterId() };
        return FlowRouter.path('risk', params, queryParams);
      })()
    };
  },
  isNew() {
    const userId = Meteor.userId();

    return this.isNewDoc({ userId, doc: this.data() });
  },
  unreadMessagesCount() {
    return this.counter.get('risk-messages-not-viewed-count-' + this._id());
  },
  updateViewedBy(cb) {
    const _id = this._id();

    Meteor.defer(() => updateViewedBy.call({ _id }, cb));
  }
});
