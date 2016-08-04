import { Template } from 'meteor/templating';

Template.OrgSettings_RisksType.viewmodel({
  mixin: 'callWithFocusCheck',
  title: '',
  abbreviation: '',
  isChanged() {
    const tplData = this.templateInstance.data;
    const storedName = tplData.title;
    const storedAbbr = tplData.abbreviation;

    const title = this.title();
    const abbreviation = this.abbreviation();

    return _.every([
      title && abbreviation,
      (title !== storedName) || (abbreviation !== storedAbbr)
    ]);
  },
  onFocusOut(e) {
    if (this.isChanged()) {
      this.callWithFocusCheck(e, () => this.onChange(this));
    }
  },
  deleteFn() {
    return this.delete.bind(this);
  },
  delete() {
    this.onDelete(this);
  },
  getData() {
    return {
      title: this.title(),
      abbreviation: this.abbreviation()
    };
  }
});
