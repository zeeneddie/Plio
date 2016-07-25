import { Template } from 'meteor/templating';

Template.SS_Card_Read.viewmodel({
  mixin: ['modal', 'nonconformity', 'standard', 'risk'],
  autorun() {
    this.templateInstance.subscribe('NCImprovementPlan', this.NCId());
  },
  // NC from fixture: "Inquiry not recorded"
  NCId: "P98SExuNHZ4y8bhjc",
  organizationId: "KwKXz5RefrE5hjWJ2",
  // Standard from fixture: "3. Inquiry handling"
  StandardId: "4hecb3Gzvg5dPp7rD",
  // Risk from fixture: "Explosion of binder"
  RiskId: "aqtqWNPrc9fNi6wyp",
  // Action from fixture: "CA1 Fix machine calibration"
  ActionId: "hR3QzcjMKfZv9RQLe",
  NC() {
    return this._getNCByQuery({ _id: this.NCId() });
  },
  risk() {
    return this._getRiskByQuery({ _id: this.RiskId() });
  },
  _getNCsQuery() {
    return { standardsIds: this.StandardId() };
  },
  onOpenEditModalCb() {
    return this.openEditModal.bind(this);
  },
  openEditModal() {
    this.modal().open({
      _title: 'Standard subcards',
      template: 'SS_Card_Modal',
      NCId: this.NCId(),
      StandardId: this.StandardId(),
      RiskId: this.RiskId(),
      ActionId: this.ActionId()
    });
  },
});
