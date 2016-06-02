import { Template } from 'meteor/templating';

Template.NCList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapse', 'organization', 'modal'],
  magnitudes() {
    const organizationId = this.organizationId();
    const query = { organizationId };
    const options = { sort: { title: 1 } };
  },
  openAddNCModal() {
    this.modal().open({
      title: 'Non-conformity',
      template: 'CreateNC',
      variation: 'save'
    });
  }
});
