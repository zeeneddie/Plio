import { PhoneTypes } from '/imports/share/constants.js';


Template.UserEdit_PhoneNumber.viewmodel({
  mixin: ['modal', 'callWithFocusCheck'],
  number: '',
  type: PhoneTypes.WORK,
  events: {
    'change .c-select': function (e, tpl) {
      this.onTypeChanged();
    },
  },
  phoneTypes() {
    return _.values(PhoneTypes);
  },
  isChanged() {
    const tplData = this.templateInstance.data;
    const savedNumber = tplData.number;
    const savedType = tplData.type;

    const { number, type } = this.getData();

    return (number !== savedNumber) || (type !== savedType);
  },
  onTypeChanged() {
    if (this.isChanged()) {
      this.onChange(this);
    }
  },
  onNumberChanged(e) {
    if (this.isChanged()) {
      this.callWithFocusCheck(e, () => {
        this.onChange(this);
      });
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
      number: this.number(),
      type: this.type(),
    };
  },
});
