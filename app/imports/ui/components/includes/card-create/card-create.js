import { Template } from 'meteor/templating';

 Template.Card_Create.viewmodel({
   mixin: ['modal', 'collapsing'],
   insert(method, { ...args } = {}, cb) {
     this.modal().callMethod(method, { ...args }, (err, _id) => {
       if (err) return;

       this.modal().close();

       Meteor.setTimeout(() => {
         cb(_id, this.modal().open);

         this.expandCollapsed(_id);
       }, 400);
     });
   }
 });
