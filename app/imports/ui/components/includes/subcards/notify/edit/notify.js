import { Template } from 'meteor/templating';

import { addedToNotifyList } from '/imports/api/standards/methods.js';
import Utils from '/imports/core/utils.js';

Template.Subcards_Notify_Edit.viewmodel({
  mixin: ['search', 'user', 'members'],
  doc: '',
  documentType: '',
  placeholder: 'User to notify',
  selectArgs() {
    const {
      placeholder,
      doc: { notify:values = [] } = {}
    } = this.data();


    return {
      values,
      placeholder,
      onUpdate: ({ user, userId, users }) =>
        this.addToNotifyList(userId),
      onRemove: ({ user, userId, users }) =>
        this.update(userId, '$pull')
    };
  },
  onUpdate() {},
  update(userId, option, cb) {
    const { doc: { _id } = {} } = this.data();
    const query = { _id };
    const options = {
      [`${option}`]: {
        notify: userId
      }
    };

    this.onUpdate({ query, options }, cb);
  },
  addToNotifyList(userId) {
    const callback = (err, res) => {
      if (err) {
        return;
      }

      // TODO need one for Non-conformities, risks, actions
      if (this.documentType() === 'standard') {
        addedToNotifyList.call({
          standardId: this.doc()._id,
          userId
        }, (err, res) => {
          if (err) {
            Utils.showError(
              'Failed to send email to the user that was added to standard\'s notify list'
            );
          }
        });
      }
    };

    this.update(userId, '$addToSet', callback);
  }
});
