import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';


Template.Organizations_StandardsTypes.viewmodel({
  addStandardTypeForm() {
    Blaze.renderWithData(
      Template.Organizations_StandardsType,
      { organizationId: this.organizationId() },
      this.templateInstance.$("#standard-types-forms")[0]
    );
  },
  standardTypesCount() {
    return StandardsTypes.find({
      organizationId: this.organizationId()
    }).count();
  }
});
