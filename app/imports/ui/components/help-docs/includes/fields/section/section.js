import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';

import { HelpSections } from '/imports/share/collections/help-sections.js';

Template.HelpDocs_Section_Edit.viewmodel({
  sectionId: '',
  autorun() {
    // to fix bug wich randomly calls method
    if (this.sectionId() !== this.templateInstance.data.sectionId) {
      Tracker.nonreactive(() => this.update());
    }
  },
  onCreated() {
    if (!this.sectionId()) {
      const firstSection = _.first(Object.assign([], this.sections()));

      if (firstSection) {
        this.sectionId(firstSection._id);
      }
    }
  },
  sections() {
    return HelpSections.find({}, { sort: { index: 1 } }).fetch();
  },
  update() {
    if (!this._id) {
      return;
    }

    const { sectionId } = this.getData();
    this.parent().update({ sectionId });
  },
  getData() {
    return { sectionId: this.sectionId() };
  },
});
