import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.SelectItem.viewmodel({
  mixin: 'utils',
  autorun(computation) {
    const items = this.itemsArray();

    if (!this.loading() && items.length > 0 && !this.focused()) {
      if (!this.selected() && items.length > 0 && this.selectFirstIfNoSelected()) {
        const { _id, title } = items[0];

        this.selected(_id);
        this.value(title);
        this.lastSelectedItem({ _id, title });
        computation.stop();
      } else if (!!this.selected() && !this.value() && items.length > 0) {
        const item = this.getSelectedItem();

        this.value(item.title);
        this.lastSelectedItem({ title: item.title });
        computation.stop();
      }
    }
  },
  onRendered() {
    this.dropdown.on('show.bs.dropdown', () => this.onShow());
    this.dropdown.on('hide.bs.dropdown', () => this.onHide());
  },
  onShow() {
    this.focused(true);
    this.value('');
  },
  onHide() {
    this.focused(false);

    if (!!this.selected() && !this.value()) {
      const item = this.getSelectedItem();
      !!item && this.value(item.title);
    }
  },
  lastSelectedItem: null,
  value: '',
  selected: '',
  placeholder: '',
  content: '',
  contentData: {},
  loading: false,
  focused: false,
  excludedItems: [],
  selectFirstIfNoSelected: true,
  items: [],
  showContent() {
    return this.itemsFiltered().length > 0 || !!Template[this.content()];
  },
  itemsArray() {
    return this.toArray(this.items());
  },
  itemsFiltered() {
    return this.itemsArray().filter(({ _id }) => !this.excludedItems().includes(_id));
  },
  itemHtml(item) {
    return item.html || item.title;
  },
  select({ _id, title }) {
    this.value(title);
    this.selected(_id);
    this.lastSelectedItem({ _id, title });
    this.update();
  },
  openDropdownMenu(e) {
    if(!this.dropdown.hasClass('open')) {
      this.dropdown.find('[data-toggle="dropdown"]').dropdown('toggle');
    }
  },
  handleButtonClick() {
    this.value(this.lastSelectedItem() && this.lastSelectedItem().title || '');
  },
  onUpdate() {},
  update() {
    this.onHide();

    this.onUpdate(this);
  },
  getSelectedItem() {
    return this.itemsArray().find(({ _id }) => _id === this.selected());
  },
  getData() {
    const { value, selected, items } = this.data();
    const item = this.getSelectedItem();
    return { value, selected, items, item };
  },
  getContentData() {
    return _.extend({}, this.getData(), this.contentData());
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  clear() {
    this.value('');
    this.selected('');
  }
});
