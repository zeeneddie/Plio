import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { insert } from '/imports/api/risk-types/methods.js';

Template.RKType.viewmodel({
  mixin: ['collapsing', 'organization', 'modal', 'search'],
  typeId: '',
  section() {
    const _id = this.typeId();
    const section = RiskTypes.findOne({ _id });
    !!section ? section.title : '';
  },
  sectionTitle() {
    const child = this.child('SectionField');
    return child && child.section();
  },
  sections() {
    const query = {
      $and: [
        {
          ...this.searchObject('sectionTitle', 'title')
        },
        {
          organizationId: this.organizationId()
        }
      ]
    };
    const options = { sort: { title: 1 } };
    return RiskTypes.find(query, options);
  },
  onAddSectionCb() {
    return this.addSection.bind(this);
  },
  addSection(viewmodel, cb) {
    const { section:title } = viewmodel.getData();
    const organizationId = this.organizationId();

    this.modal().callMethod(insert, { title, organizationId }, cb);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    if (!this._id) return;

    const { sectionId } = viewmodel.getData();

    this.parent().update({ sectionId }, () => {
      Tracker.flush();
      this.expandCollapsed(this.standardId());
    });
  },
  getData() {
    const { sectionId:typeId } = this.child().getData();
    return { typeId };
  }
});
