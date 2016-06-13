import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { insert } from '/imports/api/standards-book-sections/methods.js';


Template.ESBookSection.viewmodel({
  mixin: ['search', 'modal', 'organization', 'collapsing', 'standard'],
  selectedBookSectionId: '',
  section() {
    const child = this.child('SectionField');
    return child && child.section();
  },
  bookSections() {
    const query = {
      $and: [
        {
          organizationId: this.organizationId()
        },
        {
          ...this.searchObject('section', 'title')
        }
      ]
    };
    const options = { sort: { title: 1 } };
    return StandardsBookSections.find(query, options);
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

    if (!sectionId) {
      this.modal().setError('Book section is required!');
      return;
    }

    this.parent().update({ sectionId }, () => {
      Tracker.flush();
      this.expandCollapsedStandard(this.standardId());
    });
  },
  getData() {
    return this.child('SectionField').getData();
  }
});
