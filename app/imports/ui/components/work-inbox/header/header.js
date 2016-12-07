import { Template } from 'meteor/templating';
import { WorkInboxFilters } from '/imports/api/constants.js';

Template.WorkInbox_Header.viewmodel({
  mixin: 'workInbox',
  headerArgs() {
    return {
      idToExpand: this.workItemId(),
      filters: WorkInboxFilters,
      isActiveFilter: this.isActiveWorkInboxFilter.bind(this),
      transformCurrentFilterLabel: (text, filter) => text.replace(filter.prepend, ''),
    };
  },
});
