// We need to overwright the atPwdFormBtnHelpers method to disable button during the loading
const atPwdFormBtnHelpers = AccountsTemplates.atPwdFormBtnHelpers;
atPwdFormBtnHelpers.submitDisabled = () => {
  if (AccountsTemplates.disabled()) {
    return 'disabled';
  }

  const disable = _.chain(AccountsTemplates.getFields()).map(field => field.hasError() || field.isValidating()).some().value();

  if (disable) {
    return 'disabled';
  }
};

atPwdFormBtnHelpers.isDisabled = () => AccountsTemplates.disabled();
atPwdFormBtnHelpers.getButtonLabel = text => AccountsTemplates.disabled() && text.split('/')[1] || text.split('/')[0];

Template.atModalPwdFormBtn.helpers(atPwdFormBtnHelpers);

// bugfix for Edge/IE
Template.atModalPwdFormBtn.events({
  'click #at-btn': function (event, t) {
    event.preventDefault();
    $('#at-pwd-form').trigger('submit');
  },
});
