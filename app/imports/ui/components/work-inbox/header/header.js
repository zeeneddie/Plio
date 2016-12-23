import { Template } from 'meteor/templating';
import { WorkInboxFilters } from '/imports/api/constants.js';
import HeaderOptionsMenu from '/imports/ui/react/risks/components/HeaderOptionsMenu';

Template.WorkInbox_Header.viewmodel({
  mixin: ['modal', 'workInbox'],
  headerArgs() {
    const view = this;

    return {
      idToExpand: this.workItemId(),
      filters: WorkInboxFilters,
      isActiveFilter: this.isActiveWorkInboxFilter.bind(this),
      transformCurrentFilterLabel: (text, filter) => text.replace(filter.prepend, ''),
      getOptionsMenu() {
        return {
          component: HeaderOptionsMenu,
          onHandleDataExport() {
            view.modal().open({
              template: 'ActionsExport',
              _title: 'Actions Export',
              variation: 'close',
            });
          },
        };
      },
    };
  },
});
