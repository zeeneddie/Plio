import { PhoneTypes } from '/imports/api/constants.js';


Template.UserEdit_PhoneNumber.viewmodel({
  mixin: ['modal', 'clearableField'],
  number: '',
  type: PhoneTypes.WORK,
  events: {
    'change .c-select'(e, tpl) {
      this.onTypeChanged();
    }
  },
  phoneTypes() {
    return _.values(PhoneTypes);
  },
  isChanged() {
    const tplData = this.templateInstance.data;
    const savedNumber = tplData.number;
    const savedType = tplData.type;

    const { number, type } = this.getData();

    return _.every([
      number && type,
      (number !== savedNumber) || (type !== savedType)
    ]);
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
  getData() {
    return {
      number: this.number(),
      type: this.type()
    };
  }
});
