import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';

import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { updateViewedBy } from '/imports/api/standards/methods.js';
import { UncategorizedTypeSection } from '/imports/api/constants.js';
import { handleMethodResult } from '/imports/api/helpers';

Template.Standards_Item_Read.viewmodel({
  share: 'window',
  mixin: ['organization', 'standard', 'user', 'date', {
    counter: 'counter'
  }],
  title: '',
  sectionId: '',
  typeId: '',
  owner: '',
  issueNumber: '',
  status: 'issued',
  nestingLevel: 1,
  viewedBy: [],
  notify: '',
  onCreated(template) {
    template.autorun((computation) => {
      const standardId = this.standardId();
      const _id = this._id();

      if (!_id) return;

      if (_id === standardId && this.isNew()) {
        Tracker.nonreactive(() => this.updateViewedBy(() => computation.stop()));
      }
    });

    template.autorun(() => {
      const _id = this._id();

      if (!_id) return;

      template.subscribe('messagesNotViewedCount', 'standard-messages-not-viewed-count-' + _id, _id);
    });
  },
  linkArgs() {
    const _id = this._id();
    return {
      isActive: Object.is(this.standardId(), _id),
      onClick: handler => handler({ standardId: _id }),
      href: (() => {
        const params = {
          standardId: _id,
          orgSerialNumber: this.organizationSerialNumber()
        };
        const queryParams = { filter: this.activeStandardFilterId() };
        return FlowRouter.path('standard', params, queryParams);
      })()
    };
  },
  standardType() {
    const typeId = this.typeId && this.typeId();
    return StandardTypes.findOne({ _id: typeId });
  },
  typeName() {
    return this.standardType() && this.standardType().title || UncategorizedTypeSection.title;
  },
  isNew() {
    const userId = Meteor.userId();

    return this.isNewDoc({ doc: this.data(), userId });
  },
  unreadMessagesCount() {
    return this.counter.get('standard-messages-not-viewed-count-' + this._id());
  },
  updateViewedBy(cb) {
    const _id = this._id();

    updateViewedBy.call({ _id }, handleMethodResult(cb));
  }
});
