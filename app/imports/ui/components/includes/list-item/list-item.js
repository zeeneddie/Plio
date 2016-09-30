import { Template } from 'meteor/templating';

import { Standards } from '/imports/share/collections/standards.js';

Template.ListItem.viewmodel({
  share: ['search'],
  mixin: ['collapse', 'search', 'standard'],
  rText: '',
  collapsed: true,
  hideRTextOnExpand: false,
  isRTextDisplayed() {
    return this.rText() && (!this.hideRTextOnExpand() || (this.collapsed() && this.hideRTextOnExpand()));
  },
  closeAllOnCollapse: true,
});
