import { Template } from 'meteor/templating';

Template.NCAnalysis.viewmodel({
  analysis: '',
  update({ query = {}, options = {}, ...args }, cb) {
    const analysis = { ...args };
    const arguments = { analysis, options, query };

    ViewModel.findOne('EditNC').update(arguments, cb);
  }
});
