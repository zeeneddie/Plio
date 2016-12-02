import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import pluralize from 'pluralize';
import moment from 'moment-timezone';
import { CountSubs, WorkItemSubs } from '/imports/startup/client/subsmanagers';
import { WorkItemsStore } from '/imports/share/constants';

Template.Dashboard_WorkItemStats.viewmodel({
  mixin: ['utils', 'organization', 'workInbox', {
    counter: 'counter'
  }],
  _subHandlers: [],
  isInitialDataReady: false,
  isReady: true,
  enableLimit: true,
  limit: 5,
  currentDate: new Date(),

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
      const limit = this.enableLimit() ? this.limit() : false;
      const items = Object.assign([], this.items());
      const ids = items.map(({ linkedDoc: { _id } = {} }) => _id);
      const organizationId = this.organizationId();

      this._subHandlers([
        WorkItemSubs.subscribe('workItemsOverdue', this.organizationId(), limit),
        CountSubs.subscribe('workItemsOverdueCount', 'work-items-overdue-count-' + organizationId, organizationId),
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
  hasItemsToLoad() {
    const total = this.overdueCount();
    const current = Object.assign([], this.items()).length;
    return total > current;
  },
  overdueCount() {
    return this.counter.get('work-items-overdue-count-' + this.organizationId());
  },
  hiddenOverdueItemsNumber() {
    const count = this.overdueCount() || Object.assign([], this.items()).length;
    return count - this.limit();
  },
  countText() {
    const count = this.overdueCount() || Object.assign([], this.items()).length;
    return pluralize('overdue work item', count, true);
  },
  items() {
    const query = { status: 2, assigneeId: Meteor.userId() }; // Overdue
    const options = {
      sort: {
        targetDate: -1 // New overdue items first
      }
    };
    if (this.enableLimit()) {
      options.limit = this.limit();
    }
    return this._getWorkItemsByQuery(query, options).fetch();
  },
  overdueItems() {
    const items = Object.assign([], this.items());
    const docs = items.map((item) => {
      const linkedDoc = item.linkedDoc;
      const time = `${moment(item.targetDate).from(this.currentDate(), true)} past due`;
      const { title, sequentialId } = Object.assign({}, item.getLinkedDoc());
      const type = item.type;
      const href = (() => {
        const params = { orgSerialNumber: this.organizationSerialNumber(), workItemId: item._id };
        const queryParams = this._getQueryParams(item)(Meteor.userId());
        return FlowRouter.path('workInboxItem', params, queryParams);
      })();

      return {
        sequentialId,
        title,
        linkedDoc,
        type,
        time,
        href
      };
    });

    return docs;
  },
  loadAll() {
    this.enableLimit(false);
  }
});
