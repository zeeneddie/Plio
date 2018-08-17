import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Card_Create.viewmodel({
  mixin: ['modal', 'collapsing'],
  insert(method, { ...args } = {}, cb) {
    this.modal().callMethod(method, { ...args }, (err, _id) => {
      if (err) return;

      const afterClose = () => {
        Meteor.setTimeout(() => {
          cb(_id, this.modal().open);
          this.expandCollapsed(_id);
        }, 400);
      };

      this.modal().close(afterClose);
    });
  },
});
