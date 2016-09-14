import { Template } from 'meteor/templating';
import curry from 'lodash.curry';

import { inspire } from '/imports/api/helpers.js';

 Template.Subcards_Wrapper_Add.viewmodel({
   mixin: 'addForm',
   _lText: '',
   _rText: '',
   renderContentOnInitial: true,
   addText: 'Add a new document',
   wrapperArgs() {
     return this.data(['_lText', '_rText', 'renderContentOnInitial']);
   },
   add() {
    this.onAdd(this.addForm.bind(this));
   }
 });
