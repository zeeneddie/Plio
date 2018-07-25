import { Template } from 'meteor/templating';

import { update } from '../../../../../../../api/risks/methods';

Template.Risk_Subcard.viewmodel({
  mixin: 'modal',
  callMethod() {
    return (updateFn, args, cb) => {
      updateFn(args, cb);
    };
  },
  update({ ...args }, cb = () => {}) {
    const { _id } = this.risk();
    this.modal().callMethod(update, { _id, ...args }, cb);
  },
  getData() {
    return this.child('Risk_Card_Edit_Main').getData();
  },
});
