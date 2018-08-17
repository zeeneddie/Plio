import AtInputEvents from './at_input_events.js';


_.each(AccountsTemplates.atInputRendered, (callback) => {
  Template.atModalInput.onRendered(callback);
});

// Simply 'inherites' helpers from AccountsTemplates
Template.atModalInput.helpers(AccountsTemplates.atInputHelpers);

Template.atModalInput.helpers({
  templateName() {
    if (this.template) {
      return this.template;
    }
    if (this.type === 'checkbox') {
      return 'atModalCheckboxInput';
    }
    if (this.type === 'select') {
      return 'atModalSelectInput';
    }
    if (this.type === 'radio') {
      return 'atModalRadioInput';
    }
    if (this.type === 'hidden') {
      return 'atModalHiddenInput';
    }
    return 'atModalTextInput';
  },
});

// Simply 'inherites' events from AccountsTemplates
// Template.atModalInput.events(AccountsTemplates.atInputEvents);

Template.atModalInput.events(AtInputEvents);

// Simply 'inherites' helpers from AccountsTemplates
Template.atModalTextInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atModalCheckboxInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atModalSelectInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atModalRadioInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atModalHiddenInput.helpers(AccountsTemplates.atInputHelpers);
