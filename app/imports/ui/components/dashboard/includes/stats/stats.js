import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import pluralize from 'pluralize';

Template.Dashboard_Stats.viewmodel({
  mixin: ['organization', 'workInbox', {
    counter: 'counter'
  }],
  autorun() {
    const isReady = this._subHandlers().every(handler => handler.ready());

    if (!this.isInitialDataReady()) {
      this.isInitialDataReady(isReady);
    } else {
      this.isReady(isReady);
    }
  },
  onCreated(template) {
    template.autorun(() => {
      const limit = this.limit() || 5;
      const items = Object.assign([], this.items());
      const ids = items.map(({ linkedDoc: { _id } = {} }) => _id);
      const organizationId = this.organizationId();

      this._subHandlers([
        template.subscribe('workItemsOverdue', this.organizationId(), limit),
        template.subscribe('workItemsOverdueCount', 'work-items-overdue-count-' + organizationId, organizationId),
        template.subscribe('nonConformitiesByIds', ids),
        template.subscribe('risksByIds', ids),
        template.subscribe('actionsByIds', ids)
      ]);
    });

    this.interval = Meteor.setInterval(() => {
      this.currentDate(new Date());
    }, 60 * 1000);
  },
  onDestroyed() {
    this.clearInterval();
  },
  clearInterval() {
    Meteor.clearInterval(this.interval);
  },
  _subHandlers: [],
  isInitialDataReady: false,
  isReady: true,
  limit: 5,
  currentDate: new Date(),
  hasItemsToLoad() {
    const total = this.overdueCount();
    const current = Object.assign([], this.items()).length;
    return total > current;
  },
  overdueCount() {
    return this.counter.get('work-items-overdue-count-' + this.organizationId());
  },
  countText() {
    const count = this.overdueCount() || Object.assign([], this.items()).length;
    return pluralize('work item', count, true);
  },
  items() {
    const query = { status: 2 }; // overdue
    return this._getWorkItemsByQuery(query).fetch();
  },
  overdue() {
    const items = Object.assign([], this.items());
    const docs = items.map((item) => {
      const time = `${moment(item.targetDate).from(this.currentDate(), true)} past due`;
      const { title, sequentialId } = Object.assign({}, item.getLinkedDoc());
      const href = (() => {
        const params = { orgSerialNumber: this.organizationSerialNumber(), workItemId: item._id };
        const queryParams = this._getQueryParams(item)(Meteor.userId());
        return FlowRouter.path('workInboxItem', params, queryParams);
      })();

      return {
        title,
        sequentialId,
        time,
        href
      };
    });

    return docs;
  },
  loadMore() {
    this.limit((this.limit() || 5) + 5);
  }
});
