import { Template } from 'meteor/templating';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';

Template.Subcards_Occurrences_Read.viewmodel({
  _query: {},
  occurrences() {
    return Occurrences.find({ ...this._query() });
  },
});
