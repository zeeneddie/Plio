import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.ListItem.viewmodel({
  share: ['search'],
  mixin: ['collapse', 'search', 'standard'],
  closeAllOnCollapse: true
});
