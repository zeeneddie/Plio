import { Template } from 'meteor/templating';
import { sortArrayByTitlePrefix } from '/imports/api/helpers';

Template.SimpleSelection_Edit.viewmodel({
  mixin: 'addForm',
  items: [],
  sortedItems: [],
  content: '',
  addButtonText: '',
  placeholder: '',
  showAbbreviation: false,
  onAddButtonClick({ ...args } = {}) {
    this.addForm('SimpleSelection_Edit_Item', this.getArgs({ ...args }));
  },
  getItems() {
    const items = this.items().map(item => ({
      ...item,
      titlePrefix: item.title,
    }));

    return sortArrayByTitlePrefix(items);
  },
  getArgs({ ...args } = {}) {
    return {
      placeholder: this.placeholder(),
      showAbbreviation: this.showAbbreviation(),
      onDelete: this.onDelete.bind(this),
      onChange: this.onChange.bind(this),
      ...args,
    };
  },
  onChange() {},
  onDelete() {},
});
