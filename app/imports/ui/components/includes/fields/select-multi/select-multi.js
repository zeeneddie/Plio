import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

Template.Select_Multi.viewmodel({
  mixin: ['organization', 'utils'],
  selected: [],
  selectedItemId: null,
  items: [],
  placeholder: '',
  selectFirstIfNoSelected: false,
  selectedItem: '',
  isDeleteButtonVisible: true,
  value() {
    return invoke(this.child('Select_Single'), 'value');
  },
  selectedArray() {
    return this.toArray(this.selected());
  },
  selectedIds() {
    return this.selectedArray().map(({ _id }) => _id);
  },
  onSelectCb() {
    return this.update.bind(this);
  },
  onUpdate() {},
  update(viewmodel) {
    const { item, selected: selectedItemId } = viewmodel.getData();

    viewmodel.clear();

    const selected = this.selectedArray();

    if (selected.find(({ _id }) => _id === item._id)) return;

    const newArray = selected.concat([item]);

    this.selected(newArray);
    this.selectedItem(item);

    this.onUpdate(this);
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  onRemove() {},
  remove(e) {
    const { _id: targetId } = Blaze.getData(e.target);
    const selected = this.selectedArray();
    const selectedItem = selected.find(({ _id }) => _id === targetId);

    if (!selected.find(({ _id }) => _id === targetId)) return;

    const newArray = selected.filter(({ _id }) => _id !== targetId);

    this.selectedItemId(targetId);
    this.selected(newArray);
    this.selectedItem(selectedItem);

    this.onRemove(this);
  },
  getData() {
    const { selected = [], selectedItem = {} } = this.data();
    const { _id: selectedItemId } = selectedItem;
    return { selectedItem, selectedItemId, selected: [...new Set(selected)] };
  },
});
