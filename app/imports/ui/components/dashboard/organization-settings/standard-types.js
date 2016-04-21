import { StandardTypes } from '/imports/api/standard-types/standard-types.js';


Template.Organizations_StandardTypes.viewmodel({
  addStandardTypeForm() {
    Blaze.renderWithData(
      Template.Organizations_StandardType,
      { organizationId: this.organizationId() },
      this.templateInstance.$("#standard-types-forms")[0]
    );
  },
  standardTypesCount() {
    return StandardTypes.find({
      organizationId: this.organizationId()
    }).count();
  }
});
