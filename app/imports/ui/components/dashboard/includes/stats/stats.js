import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Dashboard_Stats.viewmodel({
  mixin: ['organization', 'workInbox'],
  autorun(computation) {
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

      this._subHandlers([
        template.subscribe('workItemsOverdue', this.organizationId(), limit),
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
  items() {
    const query = { status: 2 }; // overdue
    return [];
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
