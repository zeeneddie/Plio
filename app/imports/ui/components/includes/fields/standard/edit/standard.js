import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.Standard_Edit.viewmodel({
  mixin: ['organization', 'search'],
  searchString() {
    const child = this.child('SelectItem');
    return child && child.value();
  },
  standards() {
    const organizationId = this.organizationId();
    const query = {
      ...this.searchObject('searchString', 'title'),
      organizationId,
      isDeleted: { $in: [null, false] }
    };
    const options = { sort: { title: 1 } };
    return Standards.find(query, options);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel, cb) {
    const { selected:standardId } = viewmodel.getData();
    const _id = viewmodel._id && viewmodel._id();

    this.parent().update({ standardId }, cb);
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },

});
