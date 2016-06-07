import { Template } from 'meteor/templating';

import { Occurences } from '/imports/api/occurences/occurences.js';

Template.NCOccurences.viewmodel({
  mixin: 'collapse',
  occurencesIds: [],
  occurences() {
    const query = ((() => {
      const nonConformityId = this._id && this._id();
      const ids = Array.from(this.occurencesIds() || []);
      console.log(ids);
      const _id = { $in: ids };
      return { _id, nonConformityId };
    })());
    const options = { sort: { serialNumber: 1 } };
    return Occurences.find(query, options);
  }
});
