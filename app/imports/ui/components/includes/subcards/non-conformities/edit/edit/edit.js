import { Template } from 'meteor/templating';


Template.NC_Subcard.viewmodel({
  update({ ...args }) {
    this.parent().update({ ...args });
  },
  callMethod() {
    return (...args) => {
      this.parent().callUpdate(...args);
    };
  },
  getData() {
    return this.child('NC_Card_Edit_Main').getData();
  },
});
