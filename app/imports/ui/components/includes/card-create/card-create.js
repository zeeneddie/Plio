import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Card_Create.viewmodel({
  mixin: ['modal', 'collapsing'],
  insert(method, { ...args } = {}, cb) {
    this.modal().callMethod(method, { ...args }, (err, _id) => {
      if (err) return;

<<<<<<< HEAD
      this.modal().close();

      Meteor.setTimeout(() => {
        cb(_id, this.modal().open);

        this.expandCollapsed(_id);
      }, 400);
=======
      const afterClose = () => {
        Meteor.setTimeout(() => {
          cb(_id, this.modal().open);
          this.expandCollapsed(_id);
        }, 400);
      };

      this.modal().close(afterClose);
>>>>>>> d9bedfa586277a878b2e425b1cdf3771f9696b17
    });
  },
});
