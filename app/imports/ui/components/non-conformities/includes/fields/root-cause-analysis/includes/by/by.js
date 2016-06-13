import { Template } from 'meteor/templating';

Template.NCRCABy.viewmodel({
  mixin: ['user', 'search', 'members'],
  key: '',
  by: '',
  selectFirstIfNoSelected: false,
  placeholder: '',
  label: '',
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
