import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';


Template.ESBookSection.viewmodel({
  mixin: ['search', 'modal', 'organization', 'collapsing', 'standard'],
  selectedBookSectionId: '',
  section() {
    const child = this.child('SelectItem');
    return child && child.value();
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
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected:sectionId } = viewmodel.getData();

    this.selectedBookSectionId(sectionId);

    if (!this._id) return;

    if (!sectionId) {
      this.modal().setError('Book section is required!');
      return;
    }

    this.parent().update({ sectionId }, () => {
      Tracker.flush();
      this.expandCollapsed(this.standardId());
    });
  },
  getData() {
    const { selected:sectionId } = this.child('SelectItem').getData();
    console.log(sectionId);
    return { sectionId };
  }
});
