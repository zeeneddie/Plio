import { Template } from 'meteor/templating';

import { Occurrences } from '/imports/share/collections/occurrences.js';

Template.Subcards_Occurrences_Read.viewmodel({
  _query: {},
  occurrences() {
    return Occurrences.find({ ...this._query() });
  },
});
