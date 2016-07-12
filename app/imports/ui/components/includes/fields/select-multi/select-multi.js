import { Template } from 'meteor/templating';

Template.Select_Multi.viewmodel({
  mixin: ['organization', 'utils'],
  selected: [],
  items: [],
  placeholder: '',
  selectFirstIfNoSelected: false,
  value() {
    const child = this.child('SelectItem');
    return !!child && child.value();
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
    const { item } = viewmodel.getData();

    viewmodel.clear();

    const selected = this.selectedArray();

    if (selected.find(({ _id }) => _id === item._id)) return;

    const newArray = selected.concat([item]);

    this.selected(newArray);

    this.onUpdate(this);
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  onRemove() {},
  remove(e) {
    const { _id:targetId } = Blaze.getData(e.target);

    const selected = this.selectedArray();

    if (!selected.find(({ _id }) => _id === targetId)) return;

    const newArray = selected.filter(({ _id }) => _id !== targetId);

    this.selected(newArray);

    this.onRemove(this);
  },
  getData() {
    const { selected } = this.data();
    return { selected: [...new Set(selected)] };
  }
});
