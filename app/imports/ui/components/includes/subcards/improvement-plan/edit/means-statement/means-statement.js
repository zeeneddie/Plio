import { Template } from 'meteor/templating';


Template.IPMeansStatement.viewmodel({
  mixin: 'organization',
  files: [],
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      improvementPlanId: this._id()
    };
  },
  update(...args) {
    this.parent().update(...args);
  }
})
