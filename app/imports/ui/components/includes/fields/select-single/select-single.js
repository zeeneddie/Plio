import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.Select_Single.viewmodel({
  mixin: 'utils',
  autorun: [
    function (computation) {
      const items = this.itemsArray();

      if (!this.loading() && items.length > 0 && !this.focused()) {
        if (!this.selected() && items.length > 0 && this.selectFirstIfNoSelected()) {
          const { _id, title } = items[0];

          this.selected(_id);
          this.value(title);
          computation.stop();
        } else if (!!this.selected() && !this.value() && items.length > 0) {
          const item = this.getSelectedItem();

          item && item.title && this.value(item.title);
          computation.stop();
        }
      }
    },
    function () {
      const selected = this.selected();

      if (!this.loading() && !this.focused() && _.isFunction(this.getAllItems)) {
        const selectedItem = this.getAllItems().find(({ _id }) => _id === selected);
        selectedItem && selectedItem.title && this.value(selectedItem.title);
      }
    },
  ],
  onRendered() {
    if (this.dropdown) {
      this.dropdown.on('show.bs.dropdown', e => this.onShow(e));
      this.dropdown.on('hide.bs.dropdown', e => this.onHide(e));
    }
  },
  onShow(e) {
    if (this.disabled()) {
      e.preventDefault();
      return;
    }
    this.focused(true);
    this.value('');
  },
  onHide(e) {
    this.focused(false);

    if (!!this.selected() && !this.value()) {
      const item = this.getSelectedItem();
      !!item && this.value(item.title);
    }
  },
  value: '',
  selected: null,
  placeholder: '',
  content: '',
  contentData: {},
  loading: false,
  focused: false,
  excludedItems: [],
  selectFirstIfNoSelected: true,
  items: [],
  disabled: false,
  showContent() {
    return this.itemsFiltered().length > 0 || !!Template[this.content()];
  },
  itemsArray() {
    return this.toArray(this.items());
  },
  itemsFiltered() {
    return this.itemsArray().filter(({ _id }) => !this.excludedItems().includes(_id));
  },
  itemTitle({ title }) {
    return title;
  },
  select({ _id, title }) {
    this.value(title);
    this.selected(_id);

    this.update();
  },
  onUpdate() {},
  update() {
    this.onHide();

    this.onUpdate(this);
  },
  clear() {
    this.focused(false);
    this.selected('');
    this.value('');
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  getSelectedItem() {
    return this.itemsArray().find(({ _id }) => _id === this.selected());
  },
  getData() {
    const { value, selected, items } = this.data();
    const item = this.getSelectedItem();
    return {
      value, selected, items, item,
    };
  },
  getContentData() {
    return { ...this.getData(), ...this.contentData() };
  },
  events: {
    'click input': function (e) {
      if (this.dropdown.is('.open')) {
        e.stopPropagation();
      }
    },
  },
});
