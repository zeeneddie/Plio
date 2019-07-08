import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

import HeaderMenu from '/imports/client/react/work-inbox/components/HeaderMenu';
import { WorkInboxFilterIndexes, WorkInboxFilters } from '../../../../api/constants';

Template.WorkInbox_Header.viewmodel({
  share: 'workInbox',
  mixin: 'workInbox',
  autorun() {
    if (this.isListRendered()) {
      const list = ViewModel.findOne('WorkInbox_List');
      const items = list.items();
      if (items) this.items(items);
    }
  },
  items: {
    my: {
      current: [],
      completed: [],
      deleted: [],
    },
    team: {
      current: [],
      completed: [],
      deleted: [],
    },
  },
  headerArgs() {
    const items = this.items();
    const counts = Object.keys(WorkInboxFilters).map((key) => {
      switch (items && Number(key)) {
        case WorkInboxFilterIndexes.MY_CURRENT:
          return items.my.current.length;
        case WorkInboxFilterIndexes.MY_COMPLETED:
          return items.my.completed.length;
        case WorkInboxFilterIndexes.MY_DELETED:
          return items.my.deleted.length;
        case WorkInboxFilterIndexes.TEAM_CURRENT:
          return items.team.current.length;
        case WorkInboxFilterIndexes.TEAM_COMPLETED:
          return items.team.completed.length;
        case WorkInboxFilterIndexes.TEAM_DELETED:
          return items.team.deleted.length;
        default:
          return null;
      }
    });

    return {
      idToExpand: this.workItemId(),
      filters: Object.keys(WorkInboxFilters).reduce((acc, key, index) => ({
        ...acc,
        [key]: {
          ...WorkInboxFilters[key],
          append: counts[index] ? `(${counts[index]})` : '',
        },
      }), {}),
      isActiveFilter: this.isActiveWorkInboxFilter.bind(this),
      transformHeader: () => 'Work - ',
      getOptionsMenu() {
        return {
          component: HeaderMenu,
        };
      },
    };
  },
});
