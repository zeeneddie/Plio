import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import { RisksSections } from '/imports/api/risks-sections/risks-sections.js';
import { insert } from '/imports/api/risks-sections/methods.js';

Template.RKType.viewmodel({
  mixin: ['collapsing', 'organization', 'modal'],
  typeId: '',
  section() {
    const _id = this.typeId();
    const section = RisksSections.findOne({ _id });
    !!section ? section.title : '';
  },
  sections() {
    const query = { organizationId: this.organizationId() };
    const options = { sort: { title: 1 } };
    return RisksSections.find(query, options);
  },
  addNewSection(viewmodel, cb) {
    const { section:title } = viewmodel.getData();
    const organizationId = this.organizationId();

    this.modal().callMethod(insert, { title, organizationId }, cb);
  },
  update(e, viewmodel) {
    if (!this._id) return;

    const { sectionId } = viewmodel.getData();

    this.parent().update({ sectionId }, () => {
      Tracker.flush();
      this.expandCollapsedStandard(this.standardId());
    });
  },
  getData() {
    const { sectionId:typeId } = this.child().getData();
    return { typeId };
  }
});
