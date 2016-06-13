import { Template } from 'meteor/templating';

Template.NCAnalysis.viewmodel({
  analysis: '',
  update({ query = {}, options = {}, ...args }, cb) {
    const arguments = { ...args, options, query };

    ViewModel.findOne('EditNC').update(arguments, cb);
  }
});
