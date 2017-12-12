import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import { Organizations } from '/imports/share/collections/organizations.js';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections.js';
import { canChangeOrgSettings } from '/imports/api/checkers';
import { sortArrayByTitlePrefix } from '/imports/api/helpers';

Template.ESBookSection.viewmodel({
  mixin: ['search', 'modal', 'organization', 'collapsing', 'standard'],
  autorun() {
    const section = ((() => {
      const sections = this.bookSections();
      return sections.length > 0 && sections[0];
    })());

    if (!this.selectedBookSectionId() && section) {
      this.selectedBookSectionId(section._id);
    }
  },
  selectedBookSectionId: '',
  section() {
    const child = this.child('Select_Single');
    return child && child.value();
  },
  bookSections() {
    const query = {
      $and: [
        {
          organizationId: this.organizationId(),
        },
        {
          ...this.searchObject('section', [{ name: 'title' }]),
        },
      ],
    };
    const options = { sort: { title: 1 } };
    const sections = StandardsBookSections.find(query, options).fetch();

    return sortArrayByTitlePrefix(sections);
  },
  content() {
    return canChangeOrgSettings(Meteor.userId(), this.organizationId())
      ? 'ESBookSectionCreate'
      : null;
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected: sectionId } = viewmodel.getData();

    this.selectedBookSectionId(sectionId);

    if (!this._id) return;

    if (!sectionId) {
      this.modal().setError('Standards section is required!');
      return;
    }

    this.parent().update({ sectionId }, () => {
      this.expandCollapsed(this.standardId());
    });
  },
  getData() {
    const { selected: sectionId } = this.child('Select_Single').getData();
    return { sectionId };
  },
});
