import { Template } from 'meteor/templating';

Template.TreatmentPlan_Comments.viewmodel({
  comments: '',
  update() {
    const { comments } = this.getData();

    if (this.templateInstance.data.comments === comments) return;

    this.parent().update({ comments });
  },
  getData() {
    const { comments } = this.data();
    return { comments };
  }
});
