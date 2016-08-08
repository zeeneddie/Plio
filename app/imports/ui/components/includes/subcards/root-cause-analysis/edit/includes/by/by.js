import { Template } from 'meteor/templating';

Template.RCA_ToBeCompletedBy_Edit.viewmodel({
  mixin: ['user', 'search', 'members'],
  key: '',
  by: '',
  selectFirstIfNoSelected: false,
  placeholder: '',
  label: '',
  getBy() {
    return this.by() || '';
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  onUpdate() {},
  update(viewmodel) {
    const { selected:executor } = viewmodel.getData();

    if (executor === this.templateInstance.data.by) return;

    this.by(executor);

    this.onUpdate({ executor });
  }
});
