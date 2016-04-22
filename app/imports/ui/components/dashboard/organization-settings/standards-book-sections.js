import {
  StandardsBookSections
} from '/imports/api/standards-book-sections/standards-book-sections.js';


Template.Organizations_StandardsBookSections.viewmodel({
  addStandardsBookSectionForm() {
    Blaze.renderWithData(
      Template.Organizations_StandardsBookSection,
      { organizationId: this.organizationId() },
      this.templateInstance.$("#standards-book-sections-forms")[0]
    );
  },
  standardsBookSectionsCount() {
    return StandardsBookSections.find({
      organizationId: this.organizationId()
    }).count();
  }
});
