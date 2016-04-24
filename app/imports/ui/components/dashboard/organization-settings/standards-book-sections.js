import {
  StandardsBookSections
} from '/imports/api/standards-book-sections/standards-book-sections.js';


Template.OrganizationSettings_StandardsBookSections.viewmodel({
  addStandardsBookSectionForm() {
    Blaze.renderWithData(
      Template.OrganizationSettings_StandardsBookSection,
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
