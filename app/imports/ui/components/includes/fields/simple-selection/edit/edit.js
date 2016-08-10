import { Template } from 'meteor/templating';

Template.SimpleSelection_Edit.viewmodel({
  mixin: 'addForm',
  items: [],
  content: '',
  addButtonText: '',
  placeholder: '',
  showAbbreviation: false,
  onAddButtonClick({ ...args } = {}) {
    this.addForm('SimpleSelection_Edit_Item', this.getArgs({ ...args }));
  },
  getArgs({ ...args } = {}) {
    return {
      ...args,
      placeholder: this.placeholder(),
      showAbbreviation: this.showAbbreviation(),
      onDelete: this.onDelete.bind(this),
      onChange: this.onChange.bind(this)
    }
  },
  onChange() {},
  onDelete() {}
});
