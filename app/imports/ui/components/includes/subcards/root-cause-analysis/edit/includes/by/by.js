import { Template } from 'meteor/templating';

Template.NC_RCA_By_Edit.viewmodel({
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
  update(viewmodel) {
    const { selected:by } = viewmodel.getData();

    if (by === this.templateInstance.data.by) return;

    this.by(by);

    this.parent().update({ [this.key()]: by });
  }
});
