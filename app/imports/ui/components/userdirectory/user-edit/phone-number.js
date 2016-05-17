import { PhoneTypes } from '/imports/api/constants.js';


Template.UserEdit_PhoneNumber.viewmodel({
  mixin: ['modal', 'clearableField'],
  type: PhoneTypes.WORK,
  events: {
    'change .c-select'(e, tpl) {
      this.onPropertyChanged();
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
  onPropertyChanged() {
    this.callWithFocusCheck(() => {
      if (this.isChanged()) {
        this.onChange(this);
      }
    });
  },
  getData() {
    return {
      number: this.number(),
      type: this.type()
    };
  }
});
